########################  STAGE 1  — Web build  ########################
FROM node:20-alpine AS webbuild
WORKDIR /webapp

RUN corepack enable && corepack prepare pnpm@9.1.2 --activate

COPY webapp/pnpm-lock.yaml webapp/package.json ./
RUN pnpm install --frozen-lockfile

COPY webapp .
RUN pnpm run build

########################  STAGE 2  — Python deps #######################
FROM python:3.13-bookworm AS buildpy

# системные пакеты
RUN apt-get update && apt-get install --no-install-recommends -y \
        build-essential tzdata && \
    ln -fs /usr/share/zoneinfo/Etc/UTC /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# UV
ADD https://astral.sh/uv/install.sh /install.sh
RUN chmod 655 /install.sh && /install.sh && rm /install.sh
ENV PATH="/root/.local/bin:$PATH"

WORKDIR /app

# зависимости Python  (+ APScheduler уже в pyproject)
COPY pyproject.toml .
RUN uv sync

########################  STAGE 3  — Runtime image #####################
FROM python:3.13-slim-bookworm AS production

ENV PORT=8080

WORKDIR /app

# проект
COPY . .
# готовый web-build
COPY --from=webbuild /webapp/dist webapp/dist
# виртуалка Python
COPY --from=buildpy   /app/.venv .venv
ENV PATH="/app/.venv/bin:$PATH"

# Экспонируем порт и запускаем
EXPOSE ${PORT}
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
