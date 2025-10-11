import os
import yaml

# 先尝试读取 YAML
config_path = "data/config.yaml"
if os.path.exists(config_path):
    with open(config_path, "r", encoding="utf-8") as f:
        config = yaml.safe_load(f) or {}
else:
    config = {}


def get_config(key: str, default=""):
    # YAML 优先，如果 YAML 没有就从环境变量读取
    return config.get(key, os.environ.get(key, default))


SECRET_KEY = get_config("SECRET_KEY", "fuckyou")
ALGORITHM = get_config("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(get_config("ACCESS_TOKEN_EXPIRE_MINUTES", 1440))
SYSTEM_IMAGE_PREFIX = "/api/v1/system/get_image?url="

JAVTRAILERS_AUTHENTICATION = ''

def get_environment():
    """
    返回当前环境变量配置，用于前端显示或修改
    """
    env = {
        "PROWLARR_URL": get_config("PROWLARR_URL", ""),
        "PROWLARR_KEY": get_config("PROWLARR_KEY", ""),
        "DOWNLOAD_PATH": get_config("DOWNLOAD_PATH", ""),
        "QB_HOST": get_config("QB_HOST", ""),
        "QB_PORT": get_config("QB_PORT", ""),
        "QB_USERNAME": get_config("QB_USERNAME", ""),
        "QB_PASSWORD": get_config("QB_PASSWORD", ""),
        "QB_KEYWORD_FILTER": get_config("QB_KEYWORD_FILTER", ["游戏大全", "七龍珠"]),
        "TELEGRAM_TOKEN": get_config("TELEGRAM_TOKEN", ""),
        "TELEGRAM_CHAT_ID": get_config("TELEGRAM_CHAT_ID", ""),
        "EMBY_URL": get_config("EMBY_URL",""),
        "EMBY_API_KEY": get_config("EMBY_API_KEY",""),
    }
    return env


def set_config(new_config: dict):
    """
    更新 YAML 配置文件
    1. 读取原有配置
    2. 用 new_config 覆盖/添加
    3. 保存回 YAML
    """
    global config  # 更新内存中的 config
    config.update(new_config)

    with open(config_path, "w", encoding="utf-8") as f:
        yaml.safe_dump(config, f, allow_unicode=True)
