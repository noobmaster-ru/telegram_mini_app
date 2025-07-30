from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import asyncio
import time
import os
from dotenv import load_dotenv
from app.parse_module.parse_init import main as parse_keyword

app = FastAPI()

# Путь к фронту
frontend_build_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "build")

# Раздача статики: JS, CSS, images, fonts
app.mount("/static", StaticFiles(directory=os.path.join(frontend_build_path, "static")), name="static")


templates = Jinja2Templates(directory="app/store")
load_dotenv()

# Раздача HTML-шаблонов Jinja
app.mount("/store", StaticFiles(directory="app/store"), name="store")


# Главная страница (SPA React)
@app.get("/")
async def serve_root():
    index_path = os.path.join(frontend_build_path, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"error": "React app not found"}

# React Router поддержка — все пути на клиенте
@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    index_path = os.path.join(frontend_build_path, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"error": "React app not found"}

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
        parsed = await parse_keyword(keyword, NUMBER_OF_PARSING=int(os.getenv("NUMBER_OF_PARSING")))
        exec_time = time.perf_counter() - start

        if not parsed:
            return JSONResponse(content={"result": "Ничего не найдено 😢"})

        reply = ""
        for _, item in parsed.items():
            url = item.get("link")
            name = item.get("name")
            text = f'<a href="{url}">{name}</a>'
            link_photo = f'<a href="{item['link_to_photo']}">Фото</a>'
            reply += (
                f"\n{text}\n"
                f"{item['price']}₽ (СПП = 30%)\n"
                f"{item['nmReviewRating']}⭐ ({item['nmFeedbacks']} отзывов)\n"
                f"Органическая позиция: {item['organic_position']}\n"
                f"Промо позиция: {item['promo_position']}\n"
                f"Страница в поиске: {item['page']}\n"
                f"Остатки: {item['remains']}\n"
                f"link_photo: {link_photo}"
            )
        reply += f"\n⏱ Время обработки: {exec_time:.2f} сек"
        return JSONResponse(content={
            "result": reply, 
            "status": "ok",
            "keyword": keyword, 
            "items": parsed
        }, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/render")
async def render_results(request: Request):
    data = await request.json()  # получаешь JSON от парсера
    keyword = data.get("keyword")
    items = data.get("items", {})

    # преобразуем dict в список товаров
    products = list(items.values())
    mid = len(products) // 2
    left_products = products[:mid]
    right_products = products[mid:]


    return templates.TemplateResponse("products.html", {
        "request": request, 
        "left_products": left_products,
        "right_products": right_products,
        "query": keyword
    })

# @app.get("/")
# async def root():
#     return FileResponse("app/store/index.html")