# database.py

from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime


DATABASE_URL = "sqlite:///./data/database.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)


class RSSFeed(Base):
    __tablename__ = "rss_feeds"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now)


class RSSItem(Base):
    __tablename__ = "rss_items"

    id = Column(Integer, primary_key=True, index=True)
    actors = Column(String)
    keyword = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.now)
    img = Column(String)
    link = Column(String)
    downloaded = Column(Boolean)


class ActressCollect(Base):
    __tablename__ = "actress_collect"

    id = Column(Integer, primary_key=True, index=True)
    avatar_url = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.now)


class EmbyMovie(Base):
    __tablename__ = "emby_movies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    primary = Column(String)   
    serverId = Column(String)
    indexLink = Column(String) 
    ProductionYear = Column(Integer)


def initDatabase():
    """创建数据库表（如果不存在的话）"""
    Base.metadata.create_all(bind=engine)


from typing import Generator


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()
