import requests
import re
from core.javtrailers.model import *
from core.config import set_config,get_config


def get_javtrailers_fetch_tokens() -> str:
    """
    从网页 HTML 提取 AUTH_TOKEN
    """
    url = "https://javtrailers.com/calendar"
    resp = requests.get(url, timeout=10)
    resp.raise_for_status()
    html = resp.text

    auth_match = re.search(r'AUTH_TOKEN:\s*"([^"]+)"', html)
    return auth_match.group(1) if auth_match else None

def fetch_daily_release(year: int, month: int, day: int) -> DailyRelease:
    """
    获取指定日期的 DailyRelease，如果认证失败则刷新 token 并更新 YAML 配置
    """

    url = "https://javtrailers.com/api/calendar/day"
    params = {"year": year, "month": month, "day": day}
    
    JAVTRAILERS_AUTHENTICATION = get_config("JAVTRAILERS_AUTHENTICATION")

    headers = {
        "accept": "*/*",
        "authorization": JAVTRAILERS_AUTHENTICATION,
        "user-agent": "Mozilla/5.0"
    }

    resp = requests.get(url, params=params, headers=headers)

    if resp.status_code == 401:
        new_token = get_javtrailers_fetch_tokens()
        if not new_token:
            resp.raise_for_status()

        set_config({"JAVTRAILERS_AUTHENTICATION": new_token})

        headers["authorization"] = new_token
        resp = requests.get(url, params=params, headers=headers)

    resp.raise_for_status()
    data = resp.json()

    studios = [
        Studio(
            name=s["name"],
            jpName=s["jpName"],
            slug=s["slug"],
            link=s["link"],
            videos=[Video(**v) for v in s.get("videos", [])]
        )
        for s in data.get("studios", [])
    ]

    return DailyRelease(
        date=data["date"],
        year=data["year"],
        month=data["month"],
        day=data["day"],
        totalVideos=data["totalVideos"],
        studios=studios
    )