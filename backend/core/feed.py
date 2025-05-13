from bs4 import BeautifulSoup
from core.database import get_db, KeywordFeeds, RSSFeed
from core.prowlarr import Prowlarr
from core.qbittorrent import QB
from datetime import datetime
from core.config import *
import requests
import time
from core.telegram import *
from core.avbase import *


def getLatestMovies(name: str):
    url = f"https://www.avbase.net/talents/{name}?q=&page=1"

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


def refresh_movies_feeds():
    try:
        qb_client = QB(
            host=QB_HOST,
            port=QB_PORT,
            username=QB_USERNAME,
            password=QB_PASSWORD,
            tags=None,
        )

        prowlarr = Prowlarr(PROWLARR_URL, PROWLARR_KEY)

        db = next(get_db())
        feeds = db.query(KeywordFeeds).filter(KeywordFeeds.downloaded == False).all()

        if not feeds:
            return

        for feed in feeds:
            keyword = feed.keyword
            movie_link = feed.link

            search_data = prowlarr.search(query=keyword, page=1, page_size=5)

            if not search_data:
                continue

            search_data.sort(key=lambda x: x.get("seeders", 0), reverse=True)
            best_seed = search_data[0]

            download_link = best_seed.get("downloadUrl")
            if not download_link:
                continue

            success = qb_client.add_torrent_url(download_link, DOWNLOAD_PATH,None)

            if success:
                keyword_feed = (
                    db.query(KeywordFeeds)
                    .filter(KeywordFeeds.keyword == keyword)
                    .first()
                )
                if keyword_feed:
                    keyword_feed.downloaded = True
                    db.commit()
                    
                movie_info = get_movie_info_by_url(movie_link)
                movie_details = DownloadInformation(keyword,movie_info)
                TelegramBot.Send_Message_With_Image(movie_info["cover_image"], movie_details)
                
            time.sleep(5)
        return

    except Exception as e:
        return


def refresh_actress_feeds():
    try:
        db = next(get_db())
        feeds = db.query(RSSFeed).all()

        if not feeds:
            return

        last_feed = None
        last_keyword = None
        last_link = None
        last_img = None
        
        for feed in feeds:
            name = feed.title
            items = getLatestMovies(name)
            for item in items:
                id = item["id"]
                release_date_str = item["release_date"]
                img = item["img_url"]
                link = item["avbase_link"]
                actors = len(item["actors"])

                try:
                    release_date = datetime.strptime(release_date_str, "%Y/%m/%d")
                except ValueError as e:
                    continue
                if release_date > datetime.today() and actors <= 2:
                    last_feed = KeywordFeeds(keyword=id, img=img, link=link,downloaded=False)
                    last_keyword = id
                    last_link = link
                    last_img = img
            if last_feed:
                try:
                    existing_feed = db.query(KeywordFeeds).filter_by(keyword=last_keyword).first()
                    if existing_feed:
                        existing_feed.img = last_feed.img
                        existing_feed.link = last_feed.link
                    else:
                        db.add(last_feed)

                    db.commit()
                    db.refresh(last_feed)

                    movie_info = get_movie_info_by_url(last_link)
                    movie_details = movieInformation(last_keyword, movie_info)

                    TelegramBot.Send_Message_With_Image(last_img, movie_details)

                    last_feed = None
                except Exception as e:
                    db.rollback()
            else:
                continue
            time.sleep(5)

    except Exception as e:
        return
