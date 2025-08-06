# telegram_mini_app

app/parse_module/- парсинг сайта вб (бекенд)

app/store/ - старый вариант фронта (на html странички чисто простенькие)

app/main.py - fastapi эндпоинты основные

fronted/ - фронт на js  
frontend/src/App.js  - основной файл
fronted/src/SearchPage.js - кнопка поиска (при введении поискового запроса отправляется запрос на /handle затем /render и загружаются 2 колонки с товарами)

из .env константы:
TG_BOT_TOKEN - тг токен бота в тг 
NUMBER_OF_PARSING - количество карточек для парсинга на сайте


из сайта вб парсятся(parse_module) "артикул": {данные} :

```
    "391657820": {
        "nm_id": 391657820,
        "organic_position": 145,
        "promo_position": 1,
        "price": 1924,
        "nmFeedbacks": 173,
        "nmReviewRating": 4.7,
        "five_last_feedbacks_rating": 5.0,
        "text_of_last_feedback": "Офигенное платье",
        "rate_of_last_feedback": 5,
        "page": 1,
        "link": "https://www.wildberries.ru/catalog/391657820/detail.aspx",
        "name": "Платье с воланами рюшами летнее праздничное",
        "remains": 872,
        "number_of_images": 13,
        "description": "...",
        "link_to_photos": "...;...;",
        "link_to_video": "..."
    },
```