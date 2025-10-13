from modules.metadata.avbase.model import Actress, MovieInformation



def actressInformation(name, actress_info: Actress):
    actress_details = f"*【添加订阅】*: {name}\n"
    
    if actress_info.birthday:
        actress_details += f"**出生日期**: {actress_info.birthday}\n"
    if actress_info.prefectures:
        actress_details += f"**出生地**: {actress_info.prefectures}\n"
    if actress_info.height:
        actress_details += f"**身高**: {actress_info.height}\n"
    if actress_info.hobby:
        actress_details += f"**兴趣爱好**: {actress_info.hobby}\n"
    if actress_info.blood_type:
        actress_details += f"**血型**: {actress_info.blood_type}\n"
    if actress_info.aliases:
        aliases = ', '.join(actress_info.aliases)
        actress_details += f"**别名**: {aliases}\n"
    return actress_details


def movieInformation(keyword: str, movie_info: MovieInformation) -> str:
    work = movie_info.props.pageProps.work
    genres = movie_info.props.pageProps.work.genres

    movie_details = f"*【添加订阅】*: {keyword}\n"

    if work.title:
        movie_details += f"*标题*: {work.title}\n"
    if work.products and work.products[0].maker and work.products[0].maker.name:
        movie_details += f"*制造商*: {work.products[0].maker.name}\n"
    if work.products[0].label.name:
        movie_details += f"*厂牌*: {work.products[0].label.name}\n"
    if work.min_date:
        movie_details += f"*发布日期*: {work.min_date}\n"
    if genres:
        genres_names = ', '.join([genre.name for genre in genres if genre.name])
        movie_details += f"*标签*: {genres_names}\n"
    if work.products and work.products[0].iteminfo and work.products[0].iteminfo.price:
        movie_details += f"*价格*: {work.products[0].iteminfo.price}\n"
    if work.products and work.products[0].iteminfo and work.products[0].iteminfo.volume:
        movie_details += f"*时长*: {work.products[0].iteminfo.volume} 分钟\n"

    if work.casts:
        actors = ', '.join(cast.actor.name for cast in work.casts if cast.actor.name)
        movie_details += f"*演员*: {actors}\n"

    return movie_details
    
def DownloadInformation(keyword: str, movie_info: MovieInformation) -> str:
    work = movie_info.props.pageProps.work
    genres = movie_info.props.pageProps.work.genres
    
    movie_details = f"*【开始下载】*: {keyword}\n"

    if work.title:
        movie_details += f"*标题*: {work.title}\n"
    if work.products and work.products[0].maker and work.products[0].maker.name:
        movie_details += f"*制造商*: {work.products[0].maker.name}\n"
    if work.products[0].label.name:
        movie_details += f"*厂牌*: {work.products[0].label.name}\n"
    if work.min_date:
        movie_details += f"*发布日期*: {work.min_date}\n"
    if genres:
        genres_names = ', '.join([genre.name for genre in genres if genre.name])
        movie_details += f"*标签*: {genres_names}\n"
    if work.products and work.products[0].iteminfo and work.products[0].iteminfo.price:
        movie_details += f"*价格*: {work.products[0].iteminfo.price}\n"
    if work.products and work.products[0].iteminfo and work.products[0].iteminfo.volume:
        movie_details += f"*时长*: {work.products[0].iteminfo.volume} 分钟\n"

    if work.casts:
        actors = ', '.join(cast.actor.name for cast in work.casts if cast.actor.name)
        movie_details += f"*演员*: {actors}\n"
        
    return movie_details