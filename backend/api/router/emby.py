from fastapi import APIRouter
from core.emby import *

from fastapi import Query, HTTPException
from fastapi.responses import StreamingResponse
import httpx
from io import BytesIO

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
async def get_image(url: str = Query(..., description="The image URL to fetch")):
    """
    Fetch an image from a given URL and return it.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Failed to fetch image")
            image_bytes = BytesIO(response.content)
            content_type = response.headers.get("Content-Type", "image/jpeg")
            return StreamingResponse(image_bytes, media_type=content_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching image: {str(e)}")