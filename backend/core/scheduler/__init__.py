import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.events import EVENT_JOB_EXECUTED, EVENT_JOB_ERROR
from core.logs import logging
from core.system.background_task import refresh_movies_feeds, update_emby_movies_in_db


class AppScheduler:
    def __init__(self):
        self.scheduler: AsyncIOScheduler | None = None

    def job_listener(self, event):
        if event.exception:
            logging.error(f"Job {event.job_id} failed: {event.exception}")
        else:
            logging.info(f"Job {event.job_id} completed")

    def init(self):
        if self.scheduler is not None:
            return

        self.scheduler = AsyncIOScheduler()
        self.scheduler.add_listener(
            self.job_listener,
            EVENT_JOB_EXECUTED | EVENT_JOB_ERROR,
        )
        self.scheduler.start()
        logging.info("Scheduler started")

    def add_job(self, func, trigger=None, job_id=None, name=None, **trigger_args):
        """func 可以是同步函数或协程函数"""
        trigger = trigger(**trigger_args) if trigger else IntervalTrigger(seconds=60)
        self.scheduler.add_job(func, trigger, id=job_id, name=name)
        logging.info(f"Added job: {job_id or name}")

    def shutdown(self):
        if self.scheduler:
            self.scheduler.shutdown()
            self.scheduler = None
            logging.info("Scheduler shutdown")


def init_app_scheduler() -> AppScheduler:
    """
    初始化调度器并添加默认任务
    """
    app_scheduler = AppScheduler()
    app_scheduler.init()

    app_scheduler.add_job(
        refresh_movies_feeds,
        trigger=IntervalTrigger,
        job_id="Feed",
        name="Check Feed",
        hours=7,
    )

    app_scheduler.add_job(
        update_emby_movies_in_db,
        trigger=IntervalTrigger,
        job_id="Emby",
        name="Update Emby Movies",
        hours=1,
    )

    logging.info("AppScheduler initialized with default jobs")
    return app_scheduler


_scheduler_service: AppScheduler | None = None


def init_scheduler_service():
    global _scheduler_service
    if _scheduler_service is None:
        _scheduler_service = init_app_scheduler()
    return _scheduler_service
