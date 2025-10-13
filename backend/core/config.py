import os
import yaml
from threading import Lock


class ConfigManager:
    _instance = None
    _lock = Lock()

    def __new__(cls, config_path: str = "data/config.yaml"):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._init(config_path)
        return cls._instance

    def _init(self, config_path: str):
        self.config_path = config_path
        if os.path.exists(self.config_path):
            with open(self.config_path, "r", encoding="utf-8") as f:
                self.config = yaml.safe_load(f) or {}
        else:
            self.config = {}

        self.config["SECRET_KEY"] = "fuckyou"
        self.config["ALGORITHM"] = "HS256"
        self.config["ACCESS_TOKEN_EXPIRE_MINUTES"] = int(1440)
        self.config["SYSTEM_IMAGE_PREFIX"] = "/api/v1/system/get_image?url="

    def get(self, key: str, default=""):
        return self.config.get(key, os.environ.get(key, default))

    def set(self, new_config: dict):
        self.config.update(new_config)
        with open(self.config_path, "w", encoding="utf-8") as f:
            yaml.safe_dump(self.config, f, allow_unicode=True)

    def get_environment(self):
        """
        返回当前环境变量配置，用于前端显示或修改
        """
        return {
            "PROWLARR_URL": self.config.get("PROWLARR_URL", ""),
            "PROWLARR_KEY": self.config.get("PROWLARR_KEY", ""),
            "DOWNLOAD_PATH": self.config.get("DOWNLOAD_PATH", ""),
            "QB_HOST": self.config.get("QB_HOST", ""),
            "QB_PORT": self.config.get("QB_PORT", ""),
            "QB_USERNAME": self.config.get("QB_USERNAME", ""),
            "QB_PASSWORD": self.config.get("QB_PASSWORD", ""),
            "QB_KEYWORD_FILTER": self.config.get(
                "QB_KEYWORD_FILTER", ["游戏大全", "七龍珠"]
            ),
            "TELEGRAM_TOKEN": self.config.get("TELEGRAM_TOKEN", ""),
            "TELEGRAM_CHAT_ID": self.config.get("TELEGRAM_CHAT_ID", ""),
            "EMBY_URL": self.config.get("EMBY_URL", ""),
            "EMBY_API_KEY": self.config.get("EMBY_API_KEY", ""),
        }


_config = ConfigManager()
