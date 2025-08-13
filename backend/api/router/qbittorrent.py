from core.qbittorrent import QB
from core.auth import tokenInterceptor
from fastapi import (
    HTTPException,
    Query,
    UploadFile,
    File,
    APIRouter,
    Depends,
    BackgroundTasks,
)
from io import BytesIO
from core.config import *
from core.avbase.avbase import *
from core.telegram import *
import uuid, time

router = APIRouter()


def filter_after_add_by_tag(qb_client, tag, keyword_filter, max_wait=10):
    torrent_hash = None

    try:
        for _ in range(max_wait):
            torrent_list = qb_client.get_torrents_list()
            for t in torrent_list:
                if t.get("tags") == tag:
                    torrent_hash = t.get("hash")
                    files = qb_client.get_torrent_file_by_hash(hash=torrent_hash)
                    if files:
                        qb_client.file_filter_by_keywords(
                            QB_KEYWORD_FILTER=keyword_filter
                        )
                        return
            time.sleep(1)
    finally:
        if torrent_hash:
            qb_client.qb.torrents_remove_tags(tags=tag, torrent_hashes=torrent_hash)


@router.post("/add_torrent_url")
async def add_torrent_url(
    keywords: str,
    movie_link: str,
    download_link: str,
    save_path: str,
    tags: str = None,
    isValid: str = Depends(tokenInterceptor),
    background_tasks: BackgroundTasks = None,
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

        qb_client = QB(
            host=QB_HOST,
            port=QB_PORT,
            username=QB_USERNAME,
            password=QB_PASSWORD,
            tags=tags,
        )

        random_tag = str(uuid.uuid4())[:8]

        success = qb_client.add_torrent_url(download_link, save_path, random_tag)

        if success:
            QB_KEYWORD_FILTER = [
    kw.strip() for kw in get_config("QB_KEYWORD_FILTER", "游戏大全,七龍珠").split(",") if kw.strip()
]
            background_tasks.add_task(
                filter_after_add_by_tag, qb_client, random_tag, QB_KEYWORD_FILTER
            )
            
            if keywords != "":
                movie_info = get_actors_from_work(movie_link)
                movie_details = DownloadInformation(keywords, movie_info)
                TelegramBot.Send_Message_With_Image(
                    str(movie_info.props.pageProps.work.products[0].image_url), movie_details
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
    tags: str = Query(None, description="Tags for the torrent"),
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
            tags=tags,
        )

        success = qb_client.add_torrent_file(
            file.filename, torrent_data, save_path, tags
        )

        if success:
            return {"message": "Torrent added successfully"}
        else:
            raise HTTPException(status_code=400, detail="Failed to add torrent")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
