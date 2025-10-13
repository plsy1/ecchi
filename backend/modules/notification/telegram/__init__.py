import telebot
from typing import Optional
import threading


class TelegramBot:
    def __init__(self, token: str, chat_id: str):
        self.token = token
        self.chat_id = chat_id
        self.bot: Optional[telebot.TeleBot] = None
        self._polling_thread: Optional[threading.Thread] = None

    async def start(self):
        if self.token:
            self.bot = telebot.TeleBot(self.token)

    async def shutdown(self):
        self.bot = None

    def start_handle_message(self):
        self.bot.message_handler(func=lambda message: True)(self._handle_text_message)
        self._polling_thread = threading.Thread(
            target=self.bot.polling, kwargs={"none_stop": True}
        )
        self._polling_thread.daemon = True
        self._polling_thread.start()

    def _handle_text_message(self, message):
        text = message.text
        chat_id = message.chat.id
        print(f"Received: {text} from {chat_id}")
        if self.bot:
            self.bot.send_message(chat_id, f"You said: {text}", parse_mode="Markdown")

    async def send_message(self, message: str):
        if not self.bot:
            return
        self.bot.send_message(self.chat_id, message, parse_mode="Markdown")

    async def send_message_with_image(self, img, message: str):
        if not self.bot:
            return
        self.bot.send_photo(self.chat_id, img, caption=message, parse_mode="Markdown")


_telegram_bot: TelegramBot | None = None


async def init_telegram_bot(token: str, chat_id: str) -> TelegramBot:
    global _telegram_bot
    if _telegram_bot is None:
        _telegram_bot = TelegramBot(token, chat_id)
        await _telegram_bot.start()
    return _telegram_bot


async def shutdown_telegram_bot():
    global _telegram_bot
    if _telegram_bot:
        await _telegram_bot.shutdown()
        _telegram_bot = None
