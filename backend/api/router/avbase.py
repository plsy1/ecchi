from fastapi import APIRouter, Depends
from core.auth import tokenInterceptor
from core.avbase.avbase import *

router = APIRouter()


@router.get("/actress/movies")
async def get_actress_movies(
    name: str, page: int, isValid: str = Depends(tokenInterceptor)
):
    movies = await get_movie_info_by_actress_name(name, page)
    return {"movies": movies, "page": page}


@router.get("/actress/information")
async def get_actress_information(name: str, isValid: str = Depends(tokenInterceptor)):
    return await get_actress_info_by_actress_name(name)


@router.get("/movie/information")
async def get_movie_information(url: str, isValid: str = Depends(tokenInterceptor)):
    return await get_actors_from_work(url)


@router.get("/keywords")
async def search_movies_by_keywords(
    keywords: str, page: int, isValid: str = Depends(tokenInterceptor)
):
    return await get_movie_info_by_keywords(keywords, page)


@router.get("/get_index")
async def get_index_data(isValid: str = Depends(tokenInterceptor)):
    return await get_index()


@router.get("/get_release_by_date")
async def get_relesae(yyyymmdd: str, isValid: str = Depends(tokenInterceptor)):
    if len(yyyymmdd) != 8 or not yyyymmdd.isdigit():
        raise HTTPException(status_code=400, detail="日期格式错误，应为 YYYYMMDD")

    date_str = f"{yyyymmdd[:4]}-{yyyymmdd[4:6]}-{yyyymmdd[6:8]}"

    return await get_release_grouped_by_prefix(date_str)
