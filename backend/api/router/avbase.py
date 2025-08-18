from fastapi import APIRouter, Depends
from core.auth import tokenInterceptor
from core.avbase.avbase import *

router = APIRouter()


@router.get("/actress/movies")
async def get_actress_movies(name: str, page: int, isValid: str = Depends(tokenInterceptor)):
    movies = get_movie_info_by_actress_name(name, page)
    return {"movies": movies, "page": page}

@router.get("/actress/information")
async def get_actress_information(name: str, isValid: str = Depends(tokenInterceptor)):
    info = get_actress_info_by_actress_name(name)
    return info

@router.get("/movie/information")
async def get_movie_information(url: str, isValid: str = Depends(tokenInterceptor)):
    movie_info = get_actors_from_work(url)
    return movie_info

@router.get("/keywords")
async def search_movies_by_keywords(keywords: str, page: int, isValid: str = Depends(tokenInterceptor)):
    movies = get_movie_info_by_keywords(keywords, page)
    return movies

@router.get("/get_index")
async def get_index_data(isValid: str = Depends(tokenInterceptor)):
    return get_index()


