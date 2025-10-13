from dataclasses import dataclass
from typing import List

@dataclass
class Video:
    contentId: str
    dvdId: str
    releaseDate: str
    image: str

@dataclass
class Studio:
    name: str
    jpName: str
    slug: str
    link: str
    videos: List[Video]

@dataclass
class DailyRelease:
    date: str
    year: int
    month: int
    day: int
    totalVideos: int
    studios: List[Studio]