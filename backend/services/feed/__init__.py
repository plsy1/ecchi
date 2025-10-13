from core.database import RSSItem, RSSFeed, ActressCollect, get_db
from core.logs import LOG_ERROR
from modules.metadata.avbase import *
from modules.notification.telegram.text import *
from sqlalchemy.orm import Session


async def add_movie_feed(
    actors: str, keyword: str, img: str, link: str, db: Session
) -> bool:
    existing_keyword = db.query(RSSItem).filter(RSSItem.keyword == keyword).first()
    if existing_keyword:
        try:
            existing_keyword.downloaded = False
            db.commit()
            db.refresh(existing_keyword)
            movie_info = await get_actors_from_work(link, changeImagePrefix=False)
            movie_details = movieInformation(keyword, movie_info)
            imgURL = str(movie_info.props.pageProps.work.products[0].image_url)
            from modules.notification.telegram import _telegram_bot

            await _telegram_bot.send_message_with_image(imgURL, movie_details)
            return True
        except Exception as e:
            LOG_ERROR(e)
            db.rollback()
            return False
    else:
        new_feed = RSSItem(
            actors=actors, keyword=keyword, img=img, link=link, downloaded=False
        )
        try:
            db.add(new_feed)
            db.commit()
            db.refresh(new_feed)
            movie_info = await get_actors_from_work(link, changeImagePrefix=False)
            movie_details = movieInformation(keyword, movie_info)
            imgURL = str(movie_info.props.pageProps.work.products[0].image_url)
            from modules.notification.telegram import _telegram_bot

            await _telegram_bot.send_message_with_image(imgURL, movie_details)
            return True
        except Exception as e:
            db.rollback()
            LOG_ERROR(e)
            return False


async def remove_movie_feed(
    keyword: str,
    db: Session,
):
    existing_keyword = db.query(RSSItem).filter(RSSItem.keyword == keyword).first()

    if not existing_keyword:
        raise HTTPException(status_code=404, detail="Keyword not found.")

    try:
        db.delete(existing_keyword)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        LOG_ERROR(e)
        return False


async def add_performer_feed(
    avatar_img_url: str,
    actor_name: str,
    description: str,
    db: Session,
):

    existing_feed = db.query(RSSFeed).filter(RSSFeed.url == avatar_img_url).first()
    if existing_feed:
        return True

    new_feed = RSSFeed(url=avatar_img_url, title=actor_name, description=description)

    try:
        db.add(new_feed)
        db.commit()
        db.refresh(new_feed)

        actress_info = await get_actress_info_by_actress_name(
            actor_name, changeImagePrefix=False
        )
        actress_details = actressInformation(actor_name, actress_info)
        from modules.notification.telegram import _telegram_bot

        await _telegram_bot.send_message_with_image(
            actress_info.avatar_url, actress_details
        )
        return True

    except Exception as e:
        db.rollback()
        LOG_ERROR(e)
        return False
