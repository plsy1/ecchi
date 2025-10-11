from fastapi import APIRouter
from core.emby import *

router = APIRouter()


@router.get("/get_item_counts")
async def get_item_counts():
    return emby_get_item_counts()


@router.get("/get_resume")
async def get_resume():
    return emby_get_resume_items()


@router.get("/get_latest")
async def get_latest():
    return emby_get_latest_items()


@router.get("/get_views")
async def get_latest():
    return emby_get_views()


