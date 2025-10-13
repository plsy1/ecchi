from core.logs import logging
import asyncio
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.executors.pool import ThreadPoolExecutor
from apscheduler.events import EVENT_JOB_EXECUTED, EVENT_JOB_ERROR
from core.system.background_task import *


class AppScheduler:
    def __init__(self):
        self.scheduler: BackgroundScheduler | None = None

    def job_listener(self, event):
        if event.exception:
            logging.error(f"Job {event.job_id} failed")
        else:
            logging.info(f"Job {event.job_id} completed")

    async def _run_async_func(self, coro):
        await coro

    def wrap_async(self, coro):
        """返回同步函数用于 add_job 调用异步任务"""

        def wrapper():
            asyncio.run(self._run_async_func(coro))

        return wrapper

    def init(self, max_workers: int = 5):
        if self.scheduler is not None:
            return

        executors = {"default": ThreadPoolExecutor(max_workers)}
        self.scheduler = BackgroundScheduler(executors=executors)
        self.scheduler.add_listener(
            self.job_listener,
            EVENT_JOB_EXECUTED | EVENT_JOB_ERROR,
        )
        self.scheduler.start()
        logging.info("Scheduler started")

    def add_job(
        self,
        func,
        trigger=None,
        job_id: str | None = None,
        name: str | None = None,
        **trigger_args,
    ):
        """
        func: 可以是同步函数或协程
        trigger: APScheduler 触发器类，例如 IntervalTrigger
        trigger_args: 触发器参数，例如 hours=1
        """
        if asyncio.iscoroutinefunction(func):
            func = self.wrap_async(func)

        trigger = trigger(**trigger_args) if trigger else IntervalTrigger(seconds=60)
        self.scheduler.add_job(func, trigger, id=job_id, name=name)
        logging.info(f"Added job: {job_id or name}")

    def shutdown(self):
        if self.scheduler:
            self.scheduler.shutdown()
            self.scheduler = None
            logging.info("Scheduler shutdown")


def init_app_scheduler() -> AppScheduler:
    app_scheduler = AppScheduler()
    app_scheduler.init()

    app_scheduler.add_job(
        func=refresh_feeds,
        trigger=IntervalTrigger,
        job_id="Feed",
        name="Check Feed",
        hours=7,
    )

    app_scheduler.add_job(
        func=update_emby_movies_in_db,
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
