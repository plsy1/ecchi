import requests
import json
from bs4 import BeautifulSoup
from fastapi import HTTPException
from typing import List
from collections import defaultdict
from .model import *
from .helper import *


def get_actress_info_by_actress_name(name: str) -> Actress:
    actress = Actress(name=name)

    url = f"https://www.avbase.net/talents/{name}"
    try:
        response = requests.get(url, timeout=(3, 10))
    except Exception as e:
            return
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
    try:
        response = requests.get(url, timeout=(3, 10))
    except Exception as e:
        return
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
    try:
        response = requests.get(url, timeout=(3, 10))
    except Exception as e:
        return
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


def get_release_grouped_by_prefix(date_str: str) -> List[AvbaseEverydayReleaseByPrefix]:
    """
    获取指定日期的作品列表，并按 prefix 分组
    date_str: 'YYYY-MM-DD'
    """
    url = f"https://www.avbase.net/works/date/{date_str}"
    try:
        response = requests.get(url, timeout=(3, 10))
    except Exception as e:
        return
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="获取页面失败")

    soup = BeautifulSoup(response.text, "html.parser")
    script_tag = soup.find("script", id="__NEXT_DATA__")
    if not script_tag:
        raise HTTPException(status_code=500, detail="页面数据不存在")

    data = json.loads(script_tag.string)
    works_data = data.get("props", {}).get("pageProps", {}).get("works", [])

    grouped: defaultdict[str, List[Work]] = defaultdict(list)

    for work_dict in works_data:
        products = work_dict.get("products", [])
        prefix = next(
            (
                p.get("maker", {}).get("name")
                for p in products
                if p.get("maker", {}).get("name")
            ),
            "Unknown",
        )

        try:
            work = Work(**work_dict)
            grouped[prefix].append(work)
        except Exception as e:
            continue

    groups_list: List[AvbaseEverydayReleaseByPrefix] = [
        AvbaseEverydayReleaseByPrefix(prefixName=prefix or "Unknown", works=works)
        for prefix, works in grouped.items()
    ]

    normal_groups = [g for g in groups_list if g.prefixName != "Unknown"]
    no_prefix_group = [g for g in groups_list if g.prefixName == "Unknown"]

    normal_groups_sorted = sorted(
        normal_groups, key=lambda x: len(x.works), reverse=True
    )

    result = normal_groups_sorted + no_prefix_group

    return result
