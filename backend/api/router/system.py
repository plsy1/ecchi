from fastapi import APIRouter, HTTPException, Depends, Body, BackgroundTasks
from fastapi import Depends
from core.auth import tokenInterceptor
from fastapi.responses import StreamingResponse
from fastapi import Query
import asyncio
from core.system.background_task import *
from core.system import *

router = APIRouter()
from core.config import _config


@router.get("/get_image")
async def get_image(url: str = Query(...)):
    content, headers = await asyncio.to_thread(fetch_and_cache_image, url)
    return StreamingResponse(content, media_type="image/jpeg", headers=headers)


@router.get("/getEnvironment")
async def get_app_environment(isValid: str = Depends(tokenInterceptor)):
    return _config.get_environment()


@router.post("/updateEnvironment")
async def update_environment(
    env: dict = Body(...), isValid: str = Depends(tokenInterceptor)
):
    try:
        _config.set(env)
        return {"success": True, "message": "Environment updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/refresh_emby_movies_database")
async def update(isValid: str = Depends(tokenInterceptor)):
    update_emby_movies_in_db()


@router.post("/refreshKeywordsFeeds")
async def refresh_keywords(
    isValid: str = Depends(tokenInterceptor), background_tasks: BackgroundTasks = None
):
    try:
        background_tasks.add_task(refresh_actress_feeds)
        return {"message": "Feeds refreshed and torrents added successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error occurred: {str(e)}")


@router.post("/refreshActressFeeds")
async def refresh_actress(
    isValid: str = Depends(tokenInterceptor), background_tasks: BackgroundTasks = None
):
    try:
        background_tasks.add_task(refresh_actress_feeds)
        return {"message": "Actress Feeds refreshed successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error occurred: {str(e)}")
