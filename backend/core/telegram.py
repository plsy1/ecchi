import telebot
from core.config import *


class TelegramBot:
    bot = telebot.TeleBot(token=TELEGRAM_TOKEN)

    @staticmethod
    def Send_Message_With_Image(img,message):
        TelegramBot.bot.send_photo(TELEGRAM_CHAT_ID, img, caption=message, parse_mode='Markdown')
        
    @staticmethod
    def Send_Message(message):
        TelegramBot.bot.send_message(TELEGRAM_CHAT_ID, message, parse_mode='Markdown')

def actressInformation(name,actress_info):
    actress_details = f"*【添加订阅】*: {name}\n"
    
    if actress_info.get('birth_date'):
        actress_details += f"**出生日期**: {actress_info['birth_date']}\n"
    if actress_info.get('birthplace'):
        actress_details += f"**出生地**: {actress_info['birthplace']}\n"
    if actress_info.get('height'):
        actress_details += f"**身高**: {actress_info['height']}\n"
    if actress_info.get('size'):
        actress_details += f"**三围**: {actress_info['size']}\n"
    if actress_info.get('hobbies'):
        actress_details += f"**兴趣爱好**: {actress_info['hobbies']}\n"
    if actress_info.get('blood_type'):
        actress_details += f"**血型**: {actress_info['blood_type']}\n"
    if actress_info.get('aliases'):
        aliases = ', '.join(actress_info['aliases'])
        actress_details += f"**别名**: {aliases}\n"
    return actress_details

def movieInformation(keyword,movie_info):
    movie_details = f"*【添加订阅】*: {keyword}\n"

    if movie_info.get('title'):
        movie_details += f"*标题*: {movie_info['title']}\n"
    if movie_info.get('series'):
        movie_details += f"*系列*: {movie_info['series']}\n"
    if movie_info.get('release_date'):
        movie_details += f"*发布日期*: {movie_info['release_date']}\n"
    if movie_info.get('manufacturer'):
        movie_details += f"*制造商*: {movie_info['manufacturer']}\n"
    if movie_info.get('label'):
        movie_details += f"*标签*: {movie_info['label']}\n"
    if movie_info.get('price'):
        movie_details += f"*价格*: {movie_info['price']}\n"
    if movie_info.get('duration'):
        movie_details += f"*时长*: {movie_info['duration']} 分钟\n"
    if movie_info.get('actors'):
        actors = ', '.join([actor['name'] for actor in movie_info['actors']])
        movie_details += f"*演员*: {actors}\n"
    if movie_info.get('tags'):
        tags = ', '.join(movie_info['tags'])
        movie_details += f"*标签*: {tags}\n"
        
    return movie_details
    
def DownloadInformation(keyword,movie_info):
    movie_details = f"*【开始下载】*: {keyword}\n"

    if movie_info.get('title'):
        movie_details += f"*标题*: {movie_info['title']}\n"
    if movie_info.get('series'):
        movie_details += f"*系列*: {movie_info['series']}\n"
    if movie_info.get('release_date'):
        movie_details += f"*发布日期*: {movie_info['release_date']}\n"
    if movie_info.get('manufacturer'):
        movie_details += f"*制造商*: {movie_info['manufacturer']}\n"
    if movie_info.get('label'):
        movie_details += f"*标签*: {movie_info['label']}\n"
    if movie_info.get('price'):
        movie_details += f"*价格*: {movie_info['price']}\n"
    if movie_info.get('duration'):
        movie_details += f"*时长*: {movie_info['duration']} 分钟\n"
    if movie_info.get('actors'):
        actors = ', '.join([actor['name'] for actor in movie_info['actors']])
        movie_details += f"*演员*: {actors}\n"
    if movie_info.get('tags'):
        tags = ', '.join(movie_info['tags'])
        movie_details += f"*标签*: {tags}\n"
        
    return movie_details