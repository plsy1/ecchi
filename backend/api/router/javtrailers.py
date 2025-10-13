from fastapi import APIRouter, Depends
from core.auth import tokenInterceptor
from modules.metadata.javtrailers import *

router = APIRouter()

@router.get("/getReleasebyDate")
async def get_actress_movies(yyyymmdd: str,isValid: str = Depends(tokenInterceptor)):
    yyyymmdd = str(yyyymmdd)
    if len(yyyymmdd) != 8 or not yyyymmdd.isdigit():
        raise ValueError("Date Format invalid")

    year = int(yyyymmdd[:4])
    month = int(yyyymmdd[4:6])
    day = int(yyyymmdd[6:8])

    return fetch_daily_release(year, month, day)