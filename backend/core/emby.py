import requests
import json
from typing import List, Dict
from core.config import get_config


def emby_request(path: str, params=None, method="GET", use_header=True) -> List[Dict]:
    """
    发送带 Emby API key 的请求
    :param path: API 路径，比如 '/System/Info'
    :param params: 查询参数字典
    :param method: HTTP 方法 GET / POST / ...
    :param use_header: True 使用 Header 认证，False 使用 Query 认证
    """
    if params is None:
        params = {}
        
    EMBY_URL = get_config("EMBY_URL")
    EMBY_API_KEY = get_config("EMBY_API_KEY")
    
    url = f"{EMBY_URL}/emby{path}"

    headers = {}
    if use_header:
        headers["X-Emby-Token"] = EMBY_API_KEY
    else:
        params["api_key"] = EMBY_API_KEY

    response = requests.request(method, url, headers=headers, params=params)
    response.raise_for_status()
    return json.loads(response.text)


def emby_get_userId_of_administrator() -> str:
    try:
        info = emby_request("/Users/Query", use_header=True)
        users = info.get("Items")
        for user in users:
            if user.get("Policy").get("IsAdministrator") == True:
                return user.get("Id")
    except Exception as e:
        return


def emby_get_item_counts() -> Dict:
    try:
        info = emby_request("/Items/Counts", use_header=True)
        return info
    except Exception as e:
        return


def emby_get_latest_items() -> List[Dict]:
    try:
        EMBY_URL = get_config("EMBY_URL")
        result = []
        userId = emby_get_userId_of_administrator()
        info = emby_request(f"/Users/{userId}/Items/Latest", use_header=True)
        for item in info:
            name = item.get("Name")
            id = item.get("Id")
            primary = f"/api/v1/emby/get_image?url={EMBY_URL}/Items/{id}/Images/Primary"
            serverId = item.get("ServerId")
            indexLink = f"{EMBY_URL}/web/index.html#!/item?id={id}&context=home&serverId={serverId}"
            result.append(
                {
                    "name": name,
                    "primary": primary,
                    "serverId": serverId,
                    "indexLink": indexLink,
                }
            )
        return result
    except Exception as e:
        return


def emby_get_resume_items() -> List[Dict]:
    params = {
        "Recursive": "true",
        "Fields": "BasicSyncInfo,CanDelete,CanDownload,PrimaryImageAspectRatio,ProductionYear",
        "ImageTypeLimit": 1,
        "EnableImageTypes": "Primary,Backdrop,Thumb",
        "MediaTypes": "Video",
        "Limit": 12,
    }
    try:
        EMBY_URL = get_config("EMBY_URL")
        result = []
        userId = emby_get_userId_of_administrator()
        info = emby_request(
            f"/Users/{userId}/Items/Resume", use_header=True, params=params
        )
        for item in info.get("Items"):
            name = item.get("Name")
            id = item.get("Id")
            serverId = item.get("ServerId")
            primary = f"/api/v1/emby/get_image?url={EMBY_URL}/Items/{id}/Images/Primary"
            indexLink = f"{EMBY_URL}/web/index.html#!/item?id={id}&context=home&serverId={serverId}"
            PlayedPercentage = item.get("UserData").get("PlayedPercentage")
            ProductionYear = item.get("ProductionYear")
            result.append(
                {
                    "name": name,
                    "primary": primary,
                    "serverId": serverId,
                    "indexLink": indexLink,
                    "PlayedPercentage": PlayedPercentage,
                    "ProductionYear": ProductionYear
                }
            )
        return result
    except Exception as e:
        return


def emby_get_views() -> List[Dict]:
    try:
        EMBY_URL = get_config("EMBY_URL")
        result = []
        userId = emby_get_userId_of_administrator()
        info = emby_request(f"/Users/{userId}/Views", use_header=True)
        items = info.get("Items")
        for item in items:
            name = item.get("Name")
            Id = item.get("Id")
            ServerId = item.get("ServerId")
            primary = f"/api/v1/emby/get_image?url={EMBY_URL}/Items/{Id}/Images/Primary"
            indexLink = f"{EMBY_URL}/web/index.html#!/videos?serverId={ServerId}&parentId={Id}"
            result.append(
                {
                    "name": name,
                    "primary": primary,
                    "serverId": ServerId,
                    "indexLink": indexLink,
                }
            )

        return result
    except Exception as e:
        return