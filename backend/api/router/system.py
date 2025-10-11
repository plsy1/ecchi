from fastapi import APIRouter, HTTPException, Depends, Body
from fastapi import Depends
from core.auth import tokenInterceptor
from fastapi.responses import StreamingResponse
from fastapi import Query
from core.system import fetch_and_cache_image
import asyncio
from core.system import *

router = APIRouter()


@router.get("/get_image")
async def get_image(url: str = Query(...)):
    content, headers = await asyncio.to_thread(fetch_and_cache_image, url)
    return StreamingResponse(content, media_type="image/jpeg", headers=headers)


@router.get("/getEnvironment")
async def get_app_environment(isValid: str = Depends(tokenInterceptor)):
    return get_environment()


@router.post("/updateEnvironment")
async def update_environment(
    env: dict = Body(...), isValid: str = Depends(tokenInterceptor)
):
    try:
        set_config(env)
        return {"success": True, "message": "Environment updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
