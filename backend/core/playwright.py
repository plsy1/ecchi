import asyncio
from playwright.async_api import async_playwright


class PlaywrightService:
    def __init__(self):
        self.playwright = None
        self.browser = None
        self.context = None
        self.lock = asyncio.Lock()
        self.default_user_agent = (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/140.0.0.0 Safari/537.36"
        )
        self.default_headers = {
            "DNT": "1",
            "Upgrade-Insecure-Requests": "1",
            "sec-ch-ua": '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
        }

    async def start(self, user_agent=None, extra_http_headers=None):
        async with self.lock:
            if not self.playwright:
                self.playwright = await async_playwright().start()
                self.browser = await self.playwright.chromium.launch(headless=True)

            if not self.context:
                self.context = await self.browser.new_context(
                    user_agent=user_agent or self.default_user_agent,
                    extra_http_headers=extra_http_headers or self.default_headers,
                )

    async def stop(self):
        async with self.lock:
            if self.context:
                await self.context.close()
                self.context = None

            if self.browser:
                await self.browser.close()
                self.browser = None

            if self.playwright:
                await self.playwright.stop()
                self.playwright = None

    async def get_context(self, user_agent=None, extra_http_headers=None):
        if user_agent or extra_http_headers:
            return await self.browser.new_context(
                user_agent=user_agent or self.default_user_agent,
                extra_http_headers=extra_http_headers or self.default_headers,
            )

        await self.start()
        return self.context


_playwright_service: PlaywrightService | None = None

async def init_playwright_service() -> PlaywrightService:
    global _playwright_service
    if _playwright_service is None:
        _playwright_service = PlaywrightService()
        await _playwright_service.start()
    return _playwright_service