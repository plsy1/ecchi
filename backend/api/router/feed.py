from fastapi import APIRouter, HTTPException, Depends, Form
from core.auth import *
from sqlalchemy.orm import Session
from core.database import KeywordFeeds, RSSFeed, ActressCollect, get_db
from core.telegram import *
from core.avbase.avbase import *
from core.feed import *

router = APIRouter()


@router.post("/addKeywords")
async def add_feed(
    keyword: str = Form(...),
    img: str = Form(None),
    link: str = Form(None),
    db: Session = Depends(get_db),
):
    existing_keyword = (
        db.query(KeywordFeeds).filter(KeywordFeeds.keyword == keyword).first()
    )
    if existing_keyword:
        try:
            existing_keyword.downloaded = False
            db.commit()
            db.refresh(existing_keyword)
            movie_info = get_actors_from_work(link)
            movie_details = movieInformation(keyword, movie_info)
            TelegramBot.Send_Message_With_Image(img, movie_details)
            return {
                "message": f"Keyword {keyword} already exists, updated 'downloaded' to False."
            }
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=500, detail=f"Error updating feed: {str(e)}"
            )
    else:
        new_feed = KeywordFeeds(keyword=keyword, img=img, link=link, downloaded=False)
        try:
            db.add(new_feed)
            db.commit()
            db.refresh(new_feed)
            movie_info = get_actors_from_work(link)
            movie_details = movieInformation(keyword, movie_info)
            TelegramBot.Send_Message_With_Image(img, movie_details)
            return {"message": f"Successfully added keyword: {keyword}"}
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Error adding feed: {str(e)}")


@router.delete("/delKeywords")
async def remove_feed(keyword: str = Form(...), db: Session = Depends(get_db)):
    existing_keyword = (
        db.query(KeywordFeeds).filter(KeywordFeeds.keyword == keyword).first()
    )

    if not existing_keyword:
        raise HTTPException(status_code=404, detail="Keyword not found.")

    try:
        db.delete(existing_keyword)
        db.commit()
        return {"message": f"Successfully removed keyword: {keyword}"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error removing feed: {str(e)}")


@router.post("/addFeeds")
async def add_rss_feed(
    url: str = Form(...),
    title: str = Form(...),
    description: str = Form(None),
    db: Session = Depends(get_db),
):

    existing_feed = db.query(RSSFeed).filter(RSSFeed.url == url).first()
    if existing_feed:
        raise HTTPException(status_code=400, detail="RSS feed already exists.")

    new_feed = RSSFeed(url=url, title=title, description=description)

    try:
        db.add(new_feed)
        db.commit()
        db.refresh(new_feed)

        actress_info = get_actress_info_by_actress_name(title)
        actress_details = actressInformation(title, actress_info)

        TelegramBot.Send_Message_With_Image(actress_info.avatar_url, actress_details)
        return {
            "message": f"Successfully added RSS feed: {title}",
            "feed_id": new_feed.id,
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error adding RSS feed: {str(e)}")


@router.post("/addActressCollect")
async def add_actress_collect(
    avatar_url: str = Form(...),
    name: str = Form(...),
    db: Session = Depends(get_db),
):

    existing_feed = (
        db.query(ActressCollect).filter(ActressCollect.avatar_url == avatar_url).first()
    )
    if existing_feed:
        raise HTTPException(status_code=400, detail="actress collect already exists.")

    new_collect = ActressCollect(avatar_url=avatar_url, name=name)

    try:
        db.add(new_collect)
        db.commit()
        db.refresh(new_collect)

        # actress_info = get_actress_info_by_name(name)
        # actress_details = actressInformation(name, actress_info)

        # TelegramBot.Send_Message_With_Image(actress_info["avatar_url"], actress_details)

        return {
            "message": f"Successfully added Actress to Collect: {name}",
            "feed_id": new_collect.id,
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error adding RSS feed: {str(e)}")


@router.delete("/delFeeds")
async def remove_rss_feed(url: str = Form(...), db: Session = Depends(get_db)):
    existing_feed = db.query(RSSFeed).filter(RSSFeed.url == url).first()

    if not existing_feed:
        raise HTTPException(status_code=404, detail="RSS feed not found.")

    try:
        db.delete(existing_feed)
        db.commit()
        return {"message": f"Successfully removed RSS feed: {existing_feed.title}"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Error removing RSS feed: {str(e)}"
        )


@router.delete("/delActressCollect")
async def remove_actress_collect(url: str = Form(...), db: Session = Depends(get_db)):
    existing_feed = (
        db.query(ActressCollect).filter(ActressCollect.avatar_url == url).first()
    )

    if not existing_feed:
        raise HTTPException(status_code=404, detail="Actress not found.")

    try:
        db.delete(existing_feed)
        db.commit()
        return {
            "message": f"Successfully removed Actress from Collect: {existing_feed.name}"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Error removing Actress from Collect: {str(e)}"
        )


@router.get("/getKeywordsFeedList")
async def get_keywords_feed_list(db: Session = Depends(get_db)):
    try:
        feeds = db.query(KeywordFeeds).filter(KeywordFeeds.downloaded == False).all()
        return feeds
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving feeds: {str(e)}")


@router.get("/getFeedsList")
async def get_feed_list(db: Session = Depends(get_db)):
    try:
        feeds = db.query(RSSFeed).all()
        return feeds
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving feeds: {str(e)}")


@router.get("/getCollectList")
async def get_collect_list(db: Session = Depends(get_db)):
    try:
        feeds = db.query(ActressCollect).all()
        return feeds
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving feeds: {str(e)}")


@router.post("/refreshKeywordsFeeds")
async def refresh_keywords(isValid: str = Depends(tokenInterceptor)):
    try:
        refresh_movies_feeds()

        return {"message": "Feeds refreshed and torrents added successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error occurred: {str(e)}")


@router.post("/refreshActressFeeds")
async def refresh_actress(isValid: str = Depends(tokenInterceptor)):
    try:
        refresh_actress_feeds()
        return {"message": "Actress Feeds refreshed successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error occurred: {str(e)}")
