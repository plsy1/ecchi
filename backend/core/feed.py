from bs4 import BeautifulSoup
from core.database import get_db, RSSItem, RSSFeed
from core.prowlarr import Prowlarr
from core.qbittorrent import QB
from datetime import datetime
from core.config import *
import requests
import time, uuid
from core.telegram import *
from core.avbase.avbase import *


# def filter_after_add_by_tag(qb_client, tag, keyword_filter, max_wait=10):
#     torrent_hash = None

#     try:
#         for _ in range(max_wait):
#             torrent_list = qb_client.get_torrents_list()
#             for t in torrent_list:
#                 if t.get("tags") == tag:
#                     torrent_hash = t.get("hash")
#                     files = qb_client.get_torrent_file_by_hash(hash=torrent_hash)
#                     if files:
#                         qb_client.file_filter_by_keywords(
#                             QB_KEYWORD_FILTER=keyword_filter
#                         )
#                         return
#             time.sleep(1)
#     finally:
#         if torrent_hash:
#             qb_client.qb.torrents_remove_tags(tags=tag, torrent_hashes=torrent_hash)


def refresh_movies_feeds():
    try:

        QB_HOST = get_config("QB_HOST")
        QB_PORT = get_config("QB_PORT")
        QB_USERNAME = get_config("QB_USERNAME")
        QB_PASSWORD = get_config("QB_PASSWORD")

        qb_client = QB(
            host=QB_HOST,
            port=QB_PORT,
            username=QB_USERNAME,
            password=QB_PASSWORD,
        )

        PROWLARR_URL = get_config("PROWLARR_URL")
        PROWLARR_KEY = get_config("PROWLARR_KEY")

        prowlarr = Prowlarr(PROWLARR_URL, PROWLARR_KEY)

        db = next(get_db())
        feeds = db.query(RSSItem).filter(RSSItem.downloaded == False).all()

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

            random_tag = str(uuid.uuid4())[:8]

            tags = f"Ecchi,{random_tag}"

            DOWNLOAD_PATH = get_config("DOWNLOAD_PATH")

            success = qb_client.add_torrent_url(
                download_link, f"{DOWNLOAD_PATH}/{feed.actress_name}", tags
            )

            if success:

                QB_KEYWORD_FILTER = [
                    kw.strip()
                    for kw in get_config("QB_KEYWORD_FILTER", "").split(",")
                    if kw.strip()
                ]

                qb_client.filter_after_add_by_tag(random_tag, QB_KEYWORD_FILTER)
                keyword_feed = (
                    db.query(RSSItem)
                    .filter(RSSItem.keyword == keyword)
                    .first()
                )
                if keyword_feed:
                    keyword_feed.downloaded = True
                    db.commit()

                movie_info = get_actors_from_work(movie_link)
                movie_details = DownloadInformation(keyword, movie_info)
                TelegramBot.Send_Message_With_Image(
                    str(movie_info.props.pageProps.work.products[0].image_url),
                    movie_details,
                )

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
            items = get_movie_info_by_actress_name(name, 1)
            for item in items:
                id = item.id
                release_date_str = item.release_date
                img = str(item.img_url)
                link = str(item.full_id)
                actors = len(item.actors)

                try:
                    release_date = datetime.strptime(release_date_str, "%Y/%m/%d")
                except ValueError as e:
                    continue
                if release_date > datetime.today() and actors <= 2:
                    last_feed = RSSItem(
                        actors=','.join(item.actors),
                        keyword=id,
                        img=img,
                        link=link,
                        downloaded=False,
                    )
                    last_keyword = id
                    last_link = link
                    last_img = img
            if last_feed:
                try:
                    existing_feed = (
                        db.query(RSSItem).filter_by(keyword=last_keyword).first()
                    )
                    if existing_feed:
                        existing_feed.img = last_feed.img
                        existing_feed.link = last_feed.link
                    else:
                        db.add(last_feed)

                    db.commit()
                    db.refresh(last_feed)

                    movie_info = get_actors_from_work(last_link)
                    movie_details = movieInformation(last_keyword, movie_info)
                    TelegramBot.Send_Message_With_Image(last_img, movie_details)

                    last_feed = None
                except Exception as e:
                    db.rollback()
                    print(f"DB error: {e}")
            else:
                continue
            time.sleep(5)

    except Exception as e:
        print(e)
        return
