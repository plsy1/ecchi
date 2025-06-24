from fastapi import APIRouter, Depends
from core.auth import tokenInterceptor
from core.avbase import *

router = APIRouter()


@router.get("/actress/movies")
async def get_actress_movies(name: str, page: int, isValid: str = Depends(tokenInterceptor)):
    movies = get_movie_info_by_actress(name, page)
    return {"movies": movies, "page": page}

@router.get("/actress/information")
async def get_actress_information(name: str, isValid: str = Depends(tokenInterceptor)):
    info = get_actress_info_by_name(name)
    return info

@router.get("/movie/information")
async def get_movie_information(url: str, isValid: str = Depends(tokenInterceptor)):
    movie_info = get_movie_info_by_url(url)
    return movie_info

@router.get("/keywords")
async def search_movies_by_keywords(keywords: str, page: int, isValid: str = Depends(tokenInterceptor)):
    movies = search_by_keywords(keywords, page)
    return {"movies": movies, "page": page}