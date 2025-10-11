from apscheduler.events import EVENT_JOB_EXECUTED, EVENT_JOB_ERROR
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.executors.pool import ThreadPoolExecutor
from core.feed import *
import logging
from core.system import update_emby_movies_in_db

scheduler: BackgroundScheduler | None = None


def job_listener(event):
    if event.exception:
        logging.error(f"Job {event.job_id} failed")
    else:
        logging.info(f"Job {event.job_id} completed")


def check_rss_feeds():
    import asyncio

    asyncio.run(refresh_actress_feeds())
    asyncio.run(refresh_movies_feeds())


def initScheduler():
    global scheduler
    if scheduler is not None:
        return

    executors = {"default": ThreadPoolExecutor(5)}

    scheduler = BackgroundScheduler(executors=executors)

    scheduler.add_job(
        check_rss_feeds,
        IntervalTrigger(hours=7),
        id="Feed",
        name="Check Feed",
    )
    scheduler.add_job(
        update_emby_movies_in_db,
        IntervalTrigger(hours=1),
        id="Emby",
        name="Refresh Emby Movies in Database",
    )
    scheduler.add_listener(job_listener, EVENT_JOB_EXECUTED | EVENT_JOB_ERROR)
    scheduler.start()


def shutdownScheduler():
    global scheduler
    if scheduler:
        scheduler.shutdown()
        scheduler = None
