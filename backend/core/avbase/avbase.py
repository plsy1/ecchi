import requests
import json

from bs4 import BeautifulSoup
from fastapi import HTTPException

from .model import *
from .helper import *


def get_movie_info_by_url(url: str):
    response = requests.get(url)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="获取页面失败")

    soup = BeautifulSoup(response.text, "html.parser")

    movie_info = {}

    title_tag = soup.find("h1", class_="text-lg")
    if title_tag:
        movie_info["title"] = title_tag.get_text(strip=True)
    else:
        movie_info["title"] = "未知标题"

    img_tag = soup.find("img", class_="max-w-full max-h-full")
    if img_tag and img_tag.get("src"):
        movie_info["cover_image"] = img_tag["src"]
    else:
        movie_info["cover_image"] = "未找到封面图片"

    actors = []
    actor_tags = soup.find_all("a", class_="chip")

    for actor_tag in actor_tags:
        actor_name = actor_tag.find("span")
        actor_img_tag = actor_tag.find("img")

        if actor_name and actor_img_tag:
            actor = {
                "name": actor_name.get_text(strip=True),
                "avatar": actor_img_tag.get("src"),
            }
            actors.append(actor)

    movie_info["actors"] = actors

    tags = []
    tag_tags = soup.find_all(
        "a", class_="rounded-lg border border-solid text-sm px-2 py-1"
    )

    for tag_tag in tag_tags:
        tag_name = tag_tag.get_text(strip=True)
        tags.append(tag_name)

    movie_info["tags"] = tags

    info_divs = soup.find_all("div", class_="bg-base-100 px-4 py-2 flex flex-col gap-1")

    for info_div in info_divs:

        title = info_div.find("div", class_="text-xs")
        if title:
            title = title.get_text(strip=True)

        value = info_div.find("div", class_="text-sm")
        if value:
            value = value.get_text(strip=True)

        if title == "発売日":
            movie_info["release_date"] = value
        elif title == "メーカー":
            movie_info["manufacturer"] = value
        elif title == "レーベル":
            movie_info["label"] = value
        elif title == "シリーズ":
            movie_info["series"] = value
        elif title == "価格":
            movie_info["price"] = value
        elif title == "収録分数":
            movie_info["duration"] = value

    return movie_info


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
    newbie_talents = data.get("newbie_talents")
    popular_talents = data.get("popular_talents")

    return {
        "works": works,
        "newbie_talents": newbie_talents,
        "popular_talents": popular_talents,
    }
