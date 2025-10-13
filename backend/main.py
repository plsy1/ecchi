import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from core.config import _config
from core.logs import LOGGING_CONFIG
from core.database import initDatabase
from core.auth import initUser
from core.scheduler import init_scheduler_service
from core.playwright import init_playwright_service


def Init():
    initDatabase()
    initUser()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Init()
    scheduler = init_scheduler_service()
    playwright = await init_playwright_service()
    initRouter()

    try:
        yield
    finally:
        await playwright.stop()
        scheduler.shutdown()


App = FastAPI(lifespan=lifespan)

App.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Config = uvicorn.Config(
    App, host="0.0.0.0", port=8964, reload=True, log_config=LOGGING_CONFIG
)

Server = uvicorn.Server(Config)


def initRouter():
    from api.api import api_router

    App.include_router(api_router, prefix="/api/v1")


if __name__ == "__main__":
    Server.run()
