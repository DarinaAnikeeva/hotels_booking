# Инструкция по запуску проекта

## 1. Подготовка
Убедитесь, что установлен **Python 3.11+**.
```bash
python --version
```

## 2. Создание виртуального окружения
```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate
```

## 3. Установка зависимостей
```bash
pip install -r requirements.txt
```

## 4. Настройка `.env`
Создайте в корне проекта файл `.env`:
```env
DB_NAME=...
DB_HOST=localhost
DB_PORT=5432
DB_PASS=...
DB_USER=...

SECRET_KEY=...
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 5. Инициализация базы данных
Если таблицы не создаются автоматически при старте, выполните:
```bash
alembic upgrade head
# или, если Alembic не настроен, запустите скрипт создания таблиц из вашего проекта
```

## 6. Запуск сервера
hotels_booking/src:
```bash
python main.py
```

## 7. Открытие приложения
- 🌐 Приложение: **[http://localhost:8000](http://localhost:8000/)**
- 📘 Swagger API Docs: **[http://127.0.0.1:8000/docs](http://localhost:8000/docs)**
