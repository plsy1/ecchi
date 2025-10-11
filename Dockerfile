FROM node:22 AS frontend
COPY frontend /app/frontend
WORKDIR /app/frontend
RUN npm install && npx ng build --configuration production

FROM python:3.11-slim

COPY --from=frontend /app/frontend/dist/frontend/browser /app/frontend

WORKDIR /app

COPY requirements.txt .
RUN python3 -m pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

RUN apt-get update && apt-get install -y \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxcomposite1 \
    libxdamage1 libxrandr2 libgbm1 libasound2 libpangocairo-1.0-0 \
    libgtk-3-0 libxshmfence1 libdrm2 libx11-xcb1 libxcb-dri3-0 \
    libxfixes3 libxrender1 libxext6 libx11-6 wget curl unzip \
 && rm -rf /var/lib/apt/lists/*

RUN playwright install chromium

COPY backend /app/backend
RUN mkdir -p /app/data

RUN apt-get update && \
    apt-get install -y --no-install-recommends nginx supervisor && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh
COPY supervisord.conf /app/supervisord.conf
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
ENTRYPOINT ["bash", "/app/start.sh"]