## -------------------- Builder Stage -------------------- ##
FROM python:3.13-bookworm AS builder

RUN apt-get update || true && \
    apt-get install --no-install-recommends -y \
        tzdata \
        build-essential && \
    ln -fs /usr/share/zoneinfo/Etc/UTC /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Установим UV
ADD https://astral.sh/uv/install.sh /install.sh
RUN chmod -R 655 /install.sh && /install.sh && rm /install.sh

# Укажем путь к бинарникам UV
ENV PATH="/root/.local/bin:$PATH"

# Рабочая директория
WORKDIR /app

# Копируем зависимости
COPY pyproject.toml .

# Синхронизация окружения
RUN uv sync

# Для совместимости (по желанию)
RUN uv pip freeze > requirements.txt

## -------------------- Production Stage -------------------- ##
FROM python:3.13-slim-bookworm AS production

# Настройки из окружения
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_USER=${DB_USER}
ENV DB_NAME=${DB_NAME}
ENV DB_HOST=${DB_HOST}
ENV ACCESS_TOKEN_SECRET_KEY=${ACCESS_TOKEN_SECRET_KEY}
ENV PORT=8080

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем весь проект
COPY . .

# Копируем виртуальное окружение
COPY --from=builder /app/.venv .venv

# Прописываем виртуальное окружение в PATH
ENV PATH="/app/.venv/bin:$PATH"

# Открываем порт
EXPOSE ${PORT}

# Запуск приложения
CMD ["uvicorn", "app.main:app", "--log-level", "info", "--host", "0.0.0.0", "--port", "8080"]
