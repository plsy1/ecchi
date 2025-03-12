from apscheduler.events import EVENT_JOB_EXECUTED, EVENT_JOB_ERROR
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from core.feed import *
import logging


def job_listener(event):
    if event.exception:
        logging.error(f"Job {event.job_id} failed")
    else:
        logging.info(f"Job {event.job_id} completed")


def check_rss_feeds():
    refresh_actress_feeds()
    refresh_movies_feeds()


def initScheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        check_rss_feeds,
        IntervalTrigger(hours=6),
        id="Feed",
        name="Check Feed",
    )

    scheduler.start()
    scheduler.add_listener(job_listener, EVENT_JOB_EXECUTED | EVENT_JOB_ERROR)


