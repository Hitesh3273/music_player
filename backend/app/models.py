from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

playlist_songs = Table(
    'playlist_songs',
    Base.metadata,
    Column('playlist_id', Integer, ForeignKey('playlists.id')),
    Column('song_id', Integer, ForeignKey('songs.id'))
)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    playlists = relationship("Playlist", back_populates="owner")

class Artist(Base):
    __tablename__ = "artists"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    
    albums = relationship("Album", back_populates="artist")
    songs = relationship("Song", back_populates="artist")

class Album(Base):
    __tablename__ = "albums"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    artist_id = Column(Integer, ForeignKey("artists.id"))
    release_year = Column(Integer)
    
    artist = relationship("Artist", back_populates="albums")
    songs = relationship("Song", back_populates="album")

class Song(Base):
    __tablename__ = "songs"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    artist_id = Column(Integer, ForeignKey("artists.id"))
    album_id = Column(Integer, ForeignKey("albums.id"))
    duration = Column(Integer)  # in seconds
    file_path = Column(String)
    
    artist = relationship("Artist", back_populates="songs")
    album = relationship("Album", back_populates="songs")
    playlists = relationship("Playlist", secondary=playlist_songs, back_populates="songs")

class Playlist(Base):
    __tablename__ = "playlists"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner = relationship("User", back_populates="playlists")
    songs = relationship("Song", secondary=playlist_songs, back_populates="playlists")