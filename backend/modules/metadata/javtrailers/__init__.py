import requests
from .model import *
from core.config import _config
from core.logs import LOG_ERROR
from backend.core.system import replace_domain_in_value


def get_javtrailers_fetch_tokens() -> str:
    """
    从网页 HTML 提取 AUTH_TOKEN
    """

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        ),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://google.com/",
    }

    url = "https://javtrailers.com"
    try:
        resp = requests.get(url, timeout=10, headers=headers)

        if resp.status_code == 403:
            return None

        resp.raise_for_status()
        html = resp.text
        import re

        auth_match = re.search(r'AUTH_TOKEN:\s*"([^"]+)"', html)
        return auth_match.group(1) if auth_match else None
    except Exception as e:
        LOG_ERROR(e)
        return None


def fetch_daily_release(year: int, month: int, day: int) -> DailyRelease:
    """
    获取指定日期的 DailyRelease，如果认证失败则刷新 token 并更新 YAML 配置
    """

    url = "https://javtrailers.com/api/calendar/day"
    params = {"year": year, "month": month, "day": day}

    JAVTRAILERS_AUTHENTICATION = _config.get("JAVTRAILERS_AUTHENTICATION")

    headers = {
        "accept": "*/*",
        "authorization": JAVTRAILERS_AUTHENTICATION,
        "user-agent": "Mozilla/5.0",
    }

    try:

        resp = requests.get(url, params=params, headers=headers)

        if resp.status_code != 200:
            new_token = get_javtrailers_fetch_tokens()
            if not new_token:
                resp.raise_for_status()

            _config.set({"JAVTRAILERS_AUTHENTICATION": new_token})

            headers["authorization"] = new_token
            resp = requests.get(url, params=params, headers=headers)

        resp.raise_for_status()
        data = resp.json()
        SYSTEM_IMAGE_PREFIX = _config.get("SYSTEM_IMAGE_PREFIX")
        studios = [
            Studio(
                name=s["name"],
                jpName=s["jpName"],
                slug=s["slug"],
                link=s["link"],
                videos=[
                    Video(**replace_domain_in_value(v, SYSTEM_IMAGE_PREFIX))
                    for v in s.get("videos", [])
                ],
            )
            for s in data.get("studios", [])
        ]

        return DailyRelease(
            date=data["date"],
            year=data["year"],
            month=data["month"],
            day=data["day"],
            totalVideos=data["totalVideos"],
            studios=studios,
        )
    except Exception as e:
        LOG_ERROR(e)
        return None
