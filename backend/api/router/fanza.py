import httpx, re
from fastapi import APIRouter, Depends
from core.auth import tokenInterceptor
from enum import Enum
from bs4 import BeautifulSoup
from core.config import _config
from core.system import replace_domain_in_value


class RankingType(Enum):
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"


router = APIRouter()


@router.get("/monthlyactress")
async def fetch_actress_ranking(
    page: int = 1, isValid: str = Depends(tokenInterceptor)
):
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://www.dmm.co.jp/digital/videoa/-/ranking/=/type=actress/",
        "Accept-Language": "ja,en;q=0.9",
    }

    cookies = {
        "age_check_done": "1",
        "ckcy": "1",
        "cklg": "ja",
    }

    url = f"https://www.dmm.co.jp/digital/videoa/-/ranking/=/term=monthly/type=actress/page={page}/"

    async with httpx.AsyncClient(
        headers=headers, cookies=cookies, follow_redirects=True
    ) as client:
        res = await client.get(url)
        soup = BeautifulSoup(res.text, "html.parser")

        actresses = []

        for td in soup.select("td.bd-b"):
            rank_tag = td.select_one("span.rank")
            rank = rank_tag.text.strip() if rank_tag else None

            img_tag = td.select_one("a > img")
            img_url = img_tag["src"] if img_tag else None
            actress_name = img_tag["alt"] if img_tag else None

            match = re.match(r"^(.*?)（", actress_name)
            actress_name = match.group(1) if match else actress_name

            profile_link_tag = td.select_one("a[href*='actress=']")
            profile_link = (
                f"https://www.dmm.co.jp{profile_link_tag['href']}"
                if profile_link_tag
                else None
            )

            latest_work_tag = td.select_one(".data a[href*='/detail/']")
            latest_work_title = (
                latest_work_tag.text.strip() if latest_work_tag else None
            )
            latest_work_link = (
                f"https://www.dmm.co.jp{latest_work_tag['href']}"
                if latest_work_tag
                else None
            )

            # 出演作品数
            work_count_text = td.get_text()
            work_count_match = re.search(r"出演作品数：(\d+)", work_count_text)
            work_count = int(work_count_match.group(1)) if work_count_match else 0

            actresses.append(
                {
                    "rank": rank,
                    "name": actress_name,
                    "image": img_url,
                    "profile_url": profile_link,
                    "latest_work": latest_work_title,
                    "latest_work_url": latest_work_link,
                    "work_count": work_count,
                }
            )

        actresses = replace_domain_in_value(
            actresses, _config.get("SYSTEM_IMAGE_PREFIX")
        )

        return actresses


@router.get("/monthlyworks")
async def fetch_dvd_ranking(
    page: int = 1,
    term: RankingType = RankingType.monthly,
    isValid: str = Depends(tokenInterceptor),
):

    base_url = "https://www.dmm.co.jp/digital/videoa/-/ranking/=/"

    if term == RankingType.daily:
        url = f"{base_url}term=daily/"
    elif term == RankingType.weekly:
        url = f"{base_url}term=weekly/page={page}/"
    elif term == RankingType.monthly:
        url = f"{base_url}term=monthly/page={page}/"
    else:
        raise ValueError("Unsupported ranking term")

    headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept-Language": "ja,en;q=0.9",
    }

    cookies = {
        "age_check_done": "1",
        "ckcy": "1",
        "cklg": "ja",
    }
    async with httpx.AsyncClient(
        headers=headers, cookies=cookies, follow_redirects=True
    ) as client:
        res = await client.get(url)
        soup = BeautifulSoup(res.text, "html.parser")

        results = []

        for td in soup.select("td.bd-b"):
            rank_tag = td.select_one("span.rank")
            rank = rank_tag.text.strip() if rank_tag else None

            img = td.select_one("a > img")
            image = img["src"].replace("pt.jpg", "pl.jpg") if img else None

            match = re.search(r"/([a-z]+\d+)/\1pl\.jpg$", image)
            number = match.group(1) if match else None

            detail_url = f"https://www.dmm.co.jp{img.parent['href']}" if img else None

            # 标题去除【独占】【新作】
            title_tag = td.select_one(".data p a")
            raw_title = title_tag.get_text(strip=True) if title_tag else None
            title = re.sub(r"【.*?】", "", raw_title).strip() if raw_title else None

            maker_tag = td.select_one("span.arrow a[href*='maker=']")
            maker = maker_tag.text.strip() if maker_tag else None

            actress_tags = td.select("a[href*='actress=']")
            actresses = [a.text.strip() for a in actress_tags]

            results.append(
                {
                    "rank": rank,
                    "title": title,
                    "number": number,
                    "image": image,
                    "detail_url": detail_url,
                    "maker": maker,
                    "actresses": actresses,
                }
            )

        results = replace_domain_in_value(results, _config.get("SYSTEM_IMAGE_PREFIX"))

        return results
