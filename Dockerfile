FROM node:22 AS frontend

COPY frontend /app/frontend

WORKDIR /app/frontend

RUN npm install -g @angular/cli && npm install && ng build --configuration production

FROM nginx

COPY --from=frontend /app/frontend/dist/frontend/browser /usr/share/nginx/html

RUN apt-get update && \
    apt-get install -y supervisor python3 python3-pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY backend /app/backend

WORKDIR /app

RUN mkdir -p /app/data

COPY requirements.txt /app/requirements.txt

RUN python3 -m pip install --upgrade pip setuptools wheel
RUN pip install --break-system-packages -r requirements.txt

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 80

COPY supervisord.conf /app/supervisord.conf
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["bash", "start.sh"]