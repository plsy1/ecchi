from fastapi import (
    HTTPException,
    Query,
    UploadFile,
    File,
    APIRouter,
    Depends,
    BackgroundTasks,
    Body,
)

from pathlib import Path
from io import BytesIO
from core.qbittorrent import QB
from core.auth import tokenInterceptor
from core.config import *
from core.avbase.avbase import *
from core.telegram import *
from core.database import RSSItem, get_db
from sqlalchemy.orm import Session


router = APIRouter()


@router.post("/get_downloading_torrents")
async def get():
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

    return qb_client.get_downloading_torrents()


@router.post("/delete_torrent")
async def delete(torrent_hash: str = Body(...), delete_files: bool = Body(True)):
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

    try:
        qb_client.delete_torrent(torrent_hash, delete_files=delete_files)
        return {
            "status": "success",
            "hash": torrent_hash,
            "deleted_files": delete_files,
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@router.post("/add_torrent_url")
async def add_torrent_url(
    keywords: str,
    movie_link: str,
    download_link: str,
    save_path: str,
    performerName: str,
    isValid: str = Depends(tokenInterceptor),
    background_tasks: BackgroundTasks = None,
    db: Session = Depends(get_db),
):
    """
    通过 URL 添加种子到 qbittorrent。

    :param download_link: 种子文件的 URL
    :param save_path: 种子保存路径
    :param tags: 可选标签
    :return: 成功与否
    """
    try:
        QB_HOST = get_config("QB_HOST")
        QB_PORT = get_config("QB_PORT")
        QB_USERNAME = get_config("QB_USERNAME")
        QB_PASSWORD = get_config("QB_PASSWORD")

        DOWNLOAD_PATH = get_config("DOWNLOAD_PATH", "")

        base_path = Path(save_path) if save_path else Path(DOWNLOAD_PATH)
        save_path = base_path / performerName

        qb_client = QB(
            host=QB_HOST,
            port=QB_PORT,
            username=QB_USERNAME,
            password=QB_PASSWORD,
        )
        import uuid

        random_tag = str(uuid.uuid4())[:8]

        tags = f"Ecchi,{random_tag}"

        success = qb_client.add_torrent_url(download_link, save_path, tags)

        if success:
            QB_KEYWORD_FILTER = [
                kw.strip()
                for kw in get_config("QB_KEYWORD_FILTER", "").split(",")
                if kw.strip()
            ]
            background_tasks.add_task(
                qb_client.filter_after_add_by_tag, random_tag, QB_KEYWORD_FILTER
            )

            if keywords != "":
                movie_info = await get_actors_from_work(movie_link)
                movie_details = DownloadInformation(keywords, movie_info)
                imgURL = str(movie_info.props.pageProps.work.products[0].image_url)
                TelegramBot.Send_Message_With_Image(
                    imgURL,
                    movie_details,
                )

                new_feed = RSSItem(
                    actors=performerName,
                    keyword=keywords,
                    img=imgURL,
                    link=movie_link,
                    downloaded=True,
                )
                try:
                    db.add(new_feed)
                    db.commit()
                    db.refresh(new_feed)
                except Exception as e:
                    db.rollback()
                    raise HTTPException(
                        status_code=500, detail=f"Error adding feed: {str(e)}"
                    )

            return {"message": "Torrent added successfully"}
        else:
            raise HTTPException(status_code=400, detail="Failed to add torrent")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/add_torrent_file")
async def add_torrent_file(
    file: UploadFile = File(...),
    save_path: str = Query(...),
    isValid: str = Depends(tokenInterceptor),
):
    """
    通过上传的种子文件添加种子到 qbittorrent。

    :param file: 上传的种子文件
    :param save_path: 种子保存路径
    :param tags: 可选标签
    :return: 成功与否
    """
    try:
        torrent_data = BytesIO(await file.read())

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

        success = qb_client.add_torrent_file(file.filename, torrent_data, save_path)

        if success:
            return {"message": "Torrent added successfully"}
        else:
            raise HTTPException(status_code=400, detail="Failed to add torrent")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
