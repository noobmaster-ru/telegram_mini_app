from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import asyncio
import time

from backend.parse_module import main as parse_keyword

app = FastAPI()

app.mount("/static", StaticFiles(directory="backend/static"), name="static")

@app.post("/handle")
async def handle_data(request: Request):
    data = await request.json()
    keyword = data.get("search_text")
    user_id = data.get("user_id")

    if not keyword:
        return JSONResponse(content={"error": "No keyword provided"}, status_code=400)
    print(f"🔍 Пользователь {user_id} ввёл запрос: {keyword}")
    start = time.perf_counter()
    try:
        parsed = await parse_keyword(keyword)
        exec_time = time.perf_counter() - start

        if not parsed:
            return JSONResponse(content={"result": "Ничего не найдено 😢"})

        reply = ""
        for _, item in parsed.items():
            url = item.get("link")
            name = item.get("name")
            text = f'<a href="{url}">{name}</a>'
            reply += (
                f"\n{text}\n"
                f"{item['price']}₽ (СПП = 30%)\n"
                f"{item['nmReviewRating']}⭐ ({item['nmFeedbacks']} отзывов)\n"
                f"Органическая позиция: {item['organic_position']}\n"
                f"Промо позиция: {item['promo_position']}\n"
                f"Страница в поиске: {item['page']}\n"
                f"Остатки: {item['remains']}\n"
            )
        reply += f"\n⏱ Время обработки: {exec_time:.2f} сек"
        return JSONResponse(content={"result": reply, "status": "ok"}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)




# @app.get("/", response_class=FileResponse)
# async def root():
#     return "backend/static/index.html"
@app.get("/")
async def root():
    return FileResponse("backend/static/index.html")