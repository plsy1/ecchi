from fastapi import APIRouter

from bs4 import BeautifulSoup
import httpx
import re

router = APIRouter()

@router.get("/monthlyactress")
async def fetch_actress_ranking(page: int = 1):
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

    async with httpx.AsyncClient(headers=headers, cookies=cookies, follow_redirects=True) as client:
        res = await client.get(url)
        soup = BeautifulSoup(res.text, "html.parser")

        actresses = []

        for td in soup.select("td.bd-b"):
            rank_tag = td.select_one("span.rank")
            rank = rank_tag.text.strip() if rank_tag else None

            img_tag = td.select_one("a > img")
            img_url = img_tag["src"] if img_tag else None
            actress_name = img_tag["alt"] if img_tag else None

            profile_link_tag = td.select_one("a[href*='actress=']")
            profile_link = (
                f"https://www.dmm.co.jp{profile_link_tag['href']}"
                if profile_link_tag else None
            )

            latest_work_tag = td.select_one(".data a[href*='/detail/']")
            latest_work_title = latest_work_tag.text.strip() if latest_work_tag else None
            latest_work_link = (
                f"https://www.dmm.co.jp{latest_work_tag['href']}"
                if latest_work_tag else None
            )

            # 出演作品数
            work_count_text = td.get_text()
            work_count_match = re.search(r"出演作品数：(\d+)", work_count_text)
            work_count = int(work_count_match.group(1)) if work_count_match else 0

            actresses.append({
                "rank": rank,
                "name": actress_name,
                "image": img_url,
                "profile_url": profile_link,
                "latest_work": latest_work_title,
                "latest_work_url": latest_work_link,
                "work_count": work_count,
            })

        return actresses