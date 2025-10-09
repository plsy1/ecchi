FROM node:22 AS frontend

COPY frontend /app/frontend

WORKDIR /app/frontend

RUN npm install -g @angular/cli && npm install && ng build --configuration production

FROM python:3.11-slim

COPY --from=frontend /app/frontend/dist/frontend/browser /app/frontend

WORKDIR /app

COPY requirements.txt .
RUN apt-get update && \
    apt-get install -y build-essential libssl-dev libffi-dev && \
    python3 -m pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt

COPY backend /app/backend
RUN mkdir -p /app/data

RUN apt-get update && \
    apt-get install -y nginx supervisor && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh
COPY supervisord.conf /app/supervisord.conf
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["bash", "start.sh"]