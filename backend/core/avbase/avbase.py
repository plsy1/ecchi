import requests
import json
from bs4 import BeautifulSoup
from fastapi import HTTPException

from .model import *
from .helper import *


def get_actress_info_by_actress_name(name: str) -> Actress:
    actress = Actress(name=name)

    url = f"https://www.avbase.net/talents/{name}"
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="获取页面失败")

    soup = BeautifulSoup(response.text, "html.parser")
    script_tag = soup.find("script", id="__NEXT_DATA__")
    if script_tag:
        data = json.loads(script_tag.string)
        page_props = data["props"]["pageProps"]
        talent = page_props.get("talent", {})

        primary = talent.get("primary", {})
        actress.avatar_url = primary.get("image_url")

        fanza = (primary.get("meta") or {}).get("fanza") or {}
        for k, v in fanza.items():
            if hasattr(actress, k):
                setattr(actress, k, v)

        actors = talent.get("actors", [])
        actress.aliases = [actor.get("name") for actor in actors if actor.get("name")]

    actress.social_media = get_social_media_links(soup)

    return actress


def get_movie_info_by_actress_name(name: str, page: int) -> List[Movie]:
    url = f"https://www.avbase.net/talents/{name}?q=&page={page}"
    return get_movies(url)


def get_movie_info_by_keywords(keywords: str, page: int) -> List[Movie]:
    url = f"https://www.avbase.net/works?q={keywords}&page={page}"
    return get_movies(url)


def get_actors_from_work(canonical_id: str) -> MovieInformation:
    url = f"https://www.avbase.net/works/{canonical_id}"
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="获取页面失败")

    soup = BeautifulSoup(response.text, "html.parser")
    script_tag = soup.find("script", id="__NEXT_DATA__")
    if not script_tag:
        raise HTTPException(status_code=500, detail="页面数据不存在")

    data = json.loads(script_tag.string)

    work = data.get("props", {}).get("pageProps", {}).get("work", {})
    min_date_str = work.get("min_date", "")
    if min_date_str:
        work["min_date"] = date_trans(min_date_str)
        data["props"]["pageProps"]["work"]["min_date"] = work["min_date"]

    movie_info = MovieInformation(**data)

    return movie_info


def get_index():
    url = f"https://www.avbase.net"
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="获取页面失败")

    soup = BeautifulSoup(response.text, "html.parser")
    script_tag = soup.find("script", id="__NEXT_DATA__")
    if not script_tag:
        raise HTTPException(status_code=500, detail="页面数据不存在")

    data = json.loads(script_tag.string)
    data = data.get("props").get("pageProps")

    works = data.get("works")
    products = [p for work in works for p in work.get("products", [])]
    newbie_talents = data.get("newbie_talents")
    popular_talents = data.get("popular_talents")

    seen_titles = set()
    unique_products = []
    for p in products:
        title = p.get("title")
        if title and title not in seen_titles:
            seen_titles.add(title)
            unique_products.append(p)

    return {
        "products": unique_products,
        "newbie_talents": newbie_talents,
        "popular_talents": popular_talents,
    }
