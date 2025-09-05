from apscheduler.events import EVENT_JOB_EXECUTED, EVENT_JOB_ERROR
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from core.feed import *
# from core.javtrailers.javtrailers import get_javtrailers_fetch_tokens
# from core.config import JAVTRAILERS_AUTHENTICATION
import logging


def job_listener(event):
    if event.exception:
        logging.error(f"Job {event.job_id} failed")
    else:
        logging.info(f"Job {event.job_id} completed")


def check_rss_feeds():
    refresh_actress_feeds()
    refresh_movies_feeds()


# def refresh_javtrailers_fetch_token():
#     JAVTRAILERS_AUTHENTICATION = get_javtrailers_fetch_tokens()


def initScheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        check_rss_feeds,
        IntervalTrigger(hours=6),
        id="Feed",
        name="Check Feed",
    )
    scheduler.add_job(
        check_rss_feeds,
        IntervalTrigger(hours=24),
        id="JAVTRAILERS_AUTHENTICATION",
        name="Refresh javtrailers",
    )

    scheduler.start()
    scheduler.add_listener(job_listener, EVENT_JOB_EXECUTED | EVENT_JOB_ERROR)
