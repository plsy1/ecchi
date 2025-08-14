from fastapi import APIRouter
from core.emby import *

from fastapi import Query, HTTPException
from fastapi.responses import StreamingResponse
import httpx
from io import BytesIO
import os
import hashlib

CACHE_DIR = "data/cache_images"
os.makedirs(CACHE_DIR, exist_ok=True)

def get_cache_path(url: str):
    return os.path.join(CACHE_DIR, hashlib.md5(url.encode()).hexdigest())

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


@router.get("/get_image")
async def get_image(url: str = Query(...)):
    cache_path = get_cache_path(url)
    
    if os.path.exists(cache_path):
        etag = str(os.path.getmtime(cache_path))
        return StreamingResponse(
            open(cache_path, "rb"),
            media_type="image/jpeg",
            headers={
                "Cache-Control": "public, max-age=86400",
                "ETag": etag
            }
        )

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        if resp.status_code != 200:
            raise HTTPException(status_code=resp.status_code, detail="Failed to fetch image")
        os.makedirs(os.path.dirname(cache_path), exist_ok=True)
        with open(cache_path, "wb") as f:
            f.write(resp.content)
        
        etag = str(os.path.getmtime(cache_path))
        return StreamingResponse(
            BytesIO(resp.content),
            media_type=resp.headers.get("Content-Type", "image/jpeg"),
            headers={
                "Cache-Control": "public, max-age=86400",
                "ETag": etag
            }
        )