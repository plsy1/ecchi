
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


    return info