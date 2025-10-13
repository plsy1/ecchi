from fastapi import APIRouter, Depends
from core.auth import tokenInterceptor
from modules.mediaServer.emby import *

router = APIRouter()
import re
def extract_jav_code(title: str) -> str:
    """
    提取 JAV 番号，例如 "EKDV-795"、"ABP-123" 等。
    返回找到的第一个番号，没找到返回原始 title
    """
    match = re.search(r'[A-Z]{2,5}-\d{1,4}', title, re.IGNORECASE)
    if match:
        return match.group(0).upper()
    return title.upper()



@router.get("/get_item_counts")
async def get_item_counts(isValid: str = Depends(tokenInterceptor)):
    return emby_get_item_counts()


@router.get("/get_resume")
async def get_resume(isValid: str = Depends(tokenInterceptor)):
    return emby_get_resume_items()


@router.get("/get_latest")
async def get_latest(isValid: str = Depends(tokenInterceptor)):
    return emby_get_latest_items()


@router.get("/get_views")
async def get_latest(isValid: str = Depends(tokenInterceptor)):
    return emby_get_views()


@router.get("/exists")
async def exists(title: str, isValid: str = Depends(tokenInterceptor)):
    jav_code = extract_jav_code(title)
    exists_flag, index_link = is_movie_in_db_partial(jav_code)
    return {"exists": exists_flag, "indexLink": index_link}