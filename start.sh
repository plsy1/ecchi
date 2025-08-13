#!/bin/bash
set -e

CONFIG_FILE="/app/data/config.yaml"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "Generating $CONFIG_FILE from environment variables..."
    cat > "$CONFIG_FILE" <<EOL
PROWLARR_URL: "${PROWLARR_URL:-}"
PROWLARR_KEY: "${PROWLARR_KEY:-}"
DOWNLOAD_PATH: "${DOWNLOAD_PATH:-}"
QB_HOST: "${QB_HOST:-}"
QB_PORT: "${QB_PORT:-}"
QB_USERNAME: "${QB_USERNAME:-}"
QB_PASSWORD: "${QB_PASSWORD:-}"
QB_KEYWORD_FILTER: "${QB_KEYWORD_FILTER:-游戏大全,七龍珠}"
TELEGRAM_TOKEN: "${TELEGRAM_TOKEN:-}"
TELEGRAM_CHAT_ID: "${TELEGRAM_CHAT_ID:-}"
EOL
else
    echo "$CONFIG_FILE already exists. Skipping generation."
fi

exec /usr/bin/supervisord -c /app/supervisord.conf