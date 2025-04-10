import os

PROWLARR_URL = os.environ.get("PROWLARR_URL", "")
PROWLARR_KEY = os.environ.get("PROWLARR_KEY", "")
DOWNLOAD_PATH = os.environ.get("DOWNLOAD_PATH", "")

SECRET_KEY = os.environ.get("SECRET_KEY", "fuckyou")
ALGORITHM = os.environ.get("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 10080)


QB_HOST = os.environ.get("QB_HOST", "")
QB_PORT = os.environ.get("QB_PORT", "")
QB_USERNAME = os.environ.get("QB_USERNAME", "")
QB_PASSWORD = os.environ.get("QB_PASSWORD", "")


TELEGRAM_TOKEN = os.environ.get("TELEGRAM_TOKEN", "")
TELEGRAM_CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID", "")