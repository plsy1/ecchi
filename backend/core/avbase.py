
from bs4 import BeautifulSoup
import requests
from fastapi import HTTPException

field_mapping = {
    "生年月日": "birth_date",
    "出身地": "birthplace",
    "身長": "height",
    "サイズ": "size",
    "趣味": "hobbies",
    "血液型": "blood_type",
}

def get_social_media_links(soup):
    """获取社交媒体链接"""
    social_media_links = []

    social_media_div = soup.find("div", class_="flex gap-2")

    if not social_media_div:
        return social_media_links

    for tooltip in social_media_div.find_all("div", class_="tooltip"):
        link_tag = tooltip.find("a")
        if link_tag:
            href = link_tag.get("href")
            username = tooltip.get("data-tip")
            social_media_links.append(
                {
                    "platform": get_platform_from_link(href),
                    "username": username,
                    "link": href,
                }
            )

    return social_media_links

def get_platform_from_link(link: str):
    """根据链接来推测平台名称"""
    if "twitter.com" in link or "x.com" in link:
        return "Twitter"
    elif "instagram.com" in link:
        return "Instagram"
    elif "tiktok.com" in link:
        return "TikTok"
    elif "avbase.net" in link:
        return "RSS"
    else:
        return "Null"


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



def get_actress_info_by_name(name: str):
    url = f"https://www.avbase.net/talents/{name}"

    info = {}
    
    info["name"] = name

    response = requests.get(url)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="获取页面失败")

    soup = BeautifulSoup(response.text, "html.parser")

    info_div = soup.find("div", class_="basis-1/3 p-2 bg-base-200 rounded-md shrink-0")

    if info_div:
        table = info_div.find("table")
        if table:
            ths = table.find_all("th")
            tds = table.find_all("td")

            if len(ths) != len(tds):
                return

            for th, td in zip(ths, tds):
                key = th.get_text(strip=True)
                value = td.get_text(strip=True)

                if key in field_mapping:
                    key = field_mapping[key]

                if value:
                    info[key] = value

    avatar_div = soup.find("div", class_="avatar")

    avatar_url = "无头像图片"
    if avatar_div:
        img_tag = avatar_div.find("img")
        if img_tag:
            avatar_url = img_tag["src"]

    info["avatar_url"] = avatar_url

    name_div = soup.find("div", class_="flex flex-wrap items-baseline")
    if name_div:
        names = []
        for span in name_div.find_all("span", class_="text-sm mx-1 flex items-end"):
            name = span.get_text(strip=True)
            names.append(name)

        info["aliases"] = names

    social_media_links = get_social_media_links(soup)

    info["social_media"] = social_media_links


    return info

def get_movie_info_by_actress(name: str,page: int):
    url = f"https://www.avbase.net/talents/{name}?q=&page={page}" 

    response = requests.get(url)

    if response.status_code != 200:
        return

    soup = BeautifulSoup(response.text, "html.parser")

    movies = []

    movie_elements = soup.find_all(
        "div",
        class_="bg-base border border-light rounded-lg overflow-hidden h-full",
    )

    for movie in movie_elements:
        id_tag = movie.find("span", class_="font-bold text-gray-500")
        movie_id = id_tag.get_text(strip=True) if id_tag else ""

        title_tag = movie.find(
            "a", class_="text-md font-bold btn-ghost rounded-lg m-1 line-clamp-5"
        )
        if not title_tag:
            title_tag = movie.find(
                "a", class_="text-md font-bold btn-ghost rounded-lg m-1 line-clamp-3"
            )

        title = title_tag.get_text(strip=True) if title_tag else ""
        link = title_tag.get("href", "") if title_tag else ""

        date_tag = movie.find("a", class_="block font-bold")
        date = date_tag.get_text(strip=True) if date_tag else ""

        img_tag = movie.find("img", loading="lazy")
        img_url = img_tag["src"] if img_tag else ""
        if img_url != "":
            img_url = img_url.replace("ps.", "pl.")

        actors = []
        actor_tags = movie.find_all("a", class_="chip chip-sm")
        for actor in actor_tags:
            actor_name = actor.get_text(strip=True)
            actors.append(actor_name)

        movie_info = {
            "id": movie_id,
            "title": title,
            "avbase_link": f"https://www.avbase.net{link}",
            "release_date": date,
            "img_url": img_url,
            "actors": actors,
        }
        movies.append(movie_info)

    return movies

def search_by_keywords(keywords: str,page:int):
    url = f"https://www.avbase.net/works?q={keywords}&page={page}"

    response = requests.get(url)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="获取页面失败")

    soup = BeautifulSoup(response.text, "html.parser")

    movies = []

    movie_elements = soup.find_all(
        "div",
        class_="bg-base border border-light rounded-lg overflow-hidden h-full",
    )

    for movie in movie_elements:

        id_tag = movie.find("span", class_="font-bold text-gray-500")
        movie_id = id_tag.get_text(strip=True) if id_tag else ""

        title_tag = movie.find(
            "a", class_="text-md font-bold btn-ghost rounded-lg m-1 line-clamp-5"
        )
        if not title_tag:
            title_tag = movie.find(
                "a", class_="text-md font-bold btn-ghost rounded-lg m-1 line-clamp-3"
            )

        title = title_tag.get_text(strip=True) if title_tag else ""
        link = title_tag.get("href", "") if title_tag else ""

        date_tag = movie.find("a", class_="block font-bold")
        date = date_tag.get_text(strip=True) if date_tag else ""

        img_tag = movie.find("img", loading="lazy")
        img_url = img_tag["src"] if img_tag else ""
        if img_url != "":
            img_url = img_url.replace("ps.", "pl.")

        actors = []
        actor_tags = movie.find_all("a", class_="chip chip-sm")
        for actor in actor_tags:
            actor_name = actor.get_text(strip=True)
            actors.append(actor_name)

        movie_info = {
            "id": movie_id,
            "title": title,
            "avbase_link": f"https://www.avbase.net{link}",
            "release_date": date,
            "img_url": img_url,
            "actors": actors,
        }
        movies.append(movie_info)
        
    return movies