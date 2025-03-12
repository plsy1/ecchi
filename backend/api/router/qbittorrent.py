from core.qbittorrent import QB
from core.auth import tokenInterceptor
from fastapi import HTTPException, Query, UploadFile, File, APIRouter, Depends
from io import BytesIO
from core.config import *
from core.avbase import *
from core.telegram import *

router = APIRouter()


@router.post("/add_torrent_url")
async def add_torrent_url(
    keywords: str,
    movie_link: str,
    download_link: str,
    save_path: str,
    tags: str = None,
    isValid: str = Depends(tokenInterceptor),
):
    """
    通过 URL 添加种子到 qbittorrent。

    :param download_link: 种子文件的 URL
    :param save_path: 种子保存路径
    :param tags: 可选标签
    :return: 成功与否
    """
    try:
        qb_client = QB(
            host=QB_HOST, 
            port=QB_PORT,
            username=QB_USERNAME,
            password=QB_PASSWORD,
            tags=tags,
        )

        success = qb_client.add_torrent_url(download_link, save_path, tags)

        if success:
            if keywords != '':
                movie_info = get_movie_info_by_url(movie_link)
                movie_details = DownloadInformation(keywords,movie_info)
                TelegramBot.Send_Message_With_Image(movie_info["cover_image"], movie_details)
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
