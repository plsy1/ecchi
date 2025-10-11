from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from fastapi import Query
from core.system import fetch_and_cache_image
import asyncio

router = APIRouter()


@router.get("/get_image")
async def get_image(url: str = Query(...)):
    content, headers = await asyncio.to_thread(fetch_and_cache_image, url)
    return StreamingResponse(content, media_type="image/jpeg", headers=headers)
