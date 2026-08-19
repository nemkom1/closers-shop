# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product

CLOSERS — Telegram Mini App для прокси-покупки товаров с POIZON (китайский маркетплейс). Пользователь оформляет заявку (из демо-каталога или свободным текстовым запросом), единственный админ (`@closersmanager`) вручную ищет товар, подтверждает цену, выкупает и организует доставку в Россию. Подробности продукта, аудитории и принципов — в [PRODUCT.md](PRODUCT.md). Дизайн-система и визуальные решения — в [DESIGN.md](DESIGN.md).

Ключевое ограничение: один живой контакт (админ), не обезличенная поддержка — не проектировать multi-agent chat/support при доработках.

## Architecture

Простой двухсервисный проект без сборки:

- **Фронтенд** — статический сайт (index.html + js/app.js + css/style.css), без бандлера/фреймворка/npm. Это Telegram WebApp SPA: единственный `index.html` содержит разметку всех "экранов" (`catalog-view`, `orders-view`, `support-view`, `admin-view`) и модалок-"листов" (`cart-sheet`, `product-modal`, `free-request-modal`, `menu-sheet`); переключение — через `showView()` в [js/app.js](js/app.js), который прячет/показывает `<div>` по id, а не через роутинг/История браузера. `order.html` — пустой, не используется, вся логика в `index.html`.
- **Бэкенд** — [backend/server.py](backend/server.py), Flask REST API, деплоится на Render (`render.yaml`) как `closers-backend`, доступен по адресу из `API_URL` в `js/app.js` (сейчас `https://closers-backend.onrender.com/api`). SQLite (`orders.db`) — на free-плане Render диск эфемерный, БД обнуляется при каждом деплое/рестарте, пока не подключён persistent disk.
- Планируется перенос хостинга (фронт и, возможно, бэк) на другую площадку — при переносе нужно обновить `API_URL` в `js/app.js` и CORS-настройки на бэкенде.

### Данные и состояние

- Корзина и вишлист хранятся в `localStorage` на клиенте (`cart`, `wishlist`), не на сервере — сервер узнаёт о заказе только в момент `submitOrder()`.
- Каталог (`CATALOG` в `js/app.js`) — захардкоженный JS-массив из 12 демо-товаров, без картинок-плейсхолдеров (реальные URL фото со сторонних CDN — StockX, Fashionphile и т.п., используются как временные референсы).
- Курс USD→RUB кэшируется в `localStorage` (`fxRate`, TTL 12 часов), подтягивается с `open.er-api.com`.
- Статусный путь заказа — единый источник истины на статусы: массив `STATUS_FLOW`/`STATUS_LABEL` в `backend/server.py` ДОЛЖЕН совпадать по порядку с `STEPS` в `js/app.js`. При добавлении/переименовании статуса менять оба места синхронно.

### Аутентификация

- Обычные пользователи не аутентифицируются — `userId` берётся из `Telegram.WebApp.initDataUnsafe.user.id` и передаётся как есть (доверие к Telegram WebApp контексту).
- Админ-эндпоинты (`/api/admin/orders`, `/api/admin/update-status`) защищены проверкой подписи Telegram `initData` (`verify_init_data` в `server.py`, HMAC по алгоритму из Telegram Bot API) + сверкой `user.id` с `ADMIN_CHAT_ID`. Админ-UI на фронте открывается только если `user.id === ADMIN_ID` (захардкожен в `js/app.js`).
- Единственный небезопасный эндпоинт для смены статуса без `initData` — `/api/update-status`, защищён общим секретом `ADMIN_SECRET` (используется `backend/admin_cli.py` — CLI для ручной смены статуса без похода в Telegram).
- Callback от Telegram-бота (кнопки подтверждения оплаты в чате админа) проходят через `/telegram-webhook`, защищён `WEBHOOK_SECRET` в заголовке `X-Telegram-Bot-Api-Secret-Token`.

### Поток оплаты

Скриншот оплаты грузится как data URL через `/api/submit-payment` → бэкенд шлёт фото админу в Telegram с inline-кнопками "Подтвердить/Отклонить" → нажатие кнопки идёт в `/telegram-webhook` → обновляет `payment_status` (`unpaid` → `submitted` → `confirmed`/`rejected`) и уведомляет пользователя.

## Commands

Бэкенд (из `backend/`):

```bash
pip install -r requirements.txt
python server.py                    # локальный запуск, порт 5000, требует .env (см. .env.example)
python view_db.py                   # дамп текущего содержимого orders.db в консоль
python admin_cli.py <orderId> <status>   # ручная смена статуса заказа (см. STATUSES в файле)
```

Фронтенд — статические файлы, сборки нет; открывать `index.html` напрямую или через любой статик-сервер. Полноценно тестировать поведение Telegram WebApp API (`window.Telegram.WebApp`) вне Telegram не получится — часть функций (`initDataUnsafe`, `HapticFeedback`, `showPopup` и т.д.) недоступна в обычном браузере.

Нет линтера, форматтера или тестового раннера, настроенных в репозитории.

## Env vars (backend/.env, см. .env.example)

`BOT_TOKEN`, `ADMIN_CHAT_ID`, `ADMIN_SECRET`, `WEBHOOK_SECRET`, опционально `API_URL` (для `admin_cli.py`) и `DB_PATH` (persistent disk на Render).
