from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from contextlib import asynccontextmanager
from core.database import initDatabase
from core.auth import initUser
from core.scheduler import initScheduler, shutdownScheduler
from core.logs import LOGGING_CONFIG
from core.playwright import playwright_service


def Init():
    initDatabase()
    initUser()
    initRouter()

@asynccontextmanager
async def lifespan(App: FastAPI):
    Init()
    initScheduler()
    await playwright_service.start()
    yield
    await playwright_service.stop()
    shutdownScheduler()


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
