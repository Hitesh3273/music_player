from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Song, Artist, Album
from pydantic import BaseModel
from typing import List
import os
import shutil

router = APIRouter()

class SongResponse(BaseModel):
    id: int
    title: str
    artist: str
    album: str
    duration: int
    
    class Config:
        from_attributes = True

class SongCreate(BaseModel):
    title: str
    artist_name: str
    album_name: str
    duration: int

@router.get("/", response_model=List[SongResponse])
def get_songs(db: Session = Depends(get_db)):
    songs = db.query(Song).all()
    return [
        SongResponse(
            id=song.id,
            title=song.title,
            artist=song.artist.name,
            album=song.album.title,
            duration=song.duration
        ) for song in songs
    ]

@router.post("/", response_model=SongResponse)
def create_song(song: SongCreate, db: Session = Depends(get_db)):
    # Get or create artist
    artist = db.query(Artist).filter(Artist.name == song.artist_name).first()
    if not artist:
        artist = Artist(name=song.artist_name)
        db.add(artist)
        db.commit()
        db.refresh(artist)
    
    # Get or create album
    album = db.query(Album).filter(Album.title == song.album_name).first()
    if not album:
        album = Album(title=song.album_name, artist_id=artist.id)
        db.add(album)
        db.commit()
        db.refresh(album)
    
    # Create song
    db_song = Song(
        title=song.title,
        artist_id=artist.id,
        album_id=album.id,
        duration=song.duration
    )
    db.add(db_song)
    db.commit()
    db.refresh(db_song)
    
    return SongResponse(
        id=db_song.id,
        title=db_song.title,
        artist=artist.name,
        album=album.title,
        duration=db_song.duration
    )

@router.get("/search")
def search_songs(q: str, db: Session = Depends(get_db)):
    songs = db.query(Song).join(Artist).filter(
        Song.title.contains(q) | Artist.name.contains(q)
    ).all()
    return [
        SongResponse(
            id=song.id,
            title=song.title,
            artist=song.artist.name,
            album=song.album.title,
            duration=song.duration
        ) for song in songs
    ]

@router.post("/upload")
async def upload_song(file: UploadFile = File(...), title: str = "", artist_name: str = "", album_name: str = "", db: Session = Depends(get_db)):
    if not file.filename.endswith(('.mp3', '.wav', '.m4a')):
        raise HTTPException(status_code=400, detail="Only audio files allowed")
    
    # Save file
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Get or create artist
    artist = db.query(Artist).filter(Artist.name == artist_name).first()
    if not artist:
        artist = Artist(name=artist_name or "Unknown")
        db.add(artist)
        db.commit()
        db.refresh(artist)
    
    # Get or create album
    album = db.query(Album).filter(Album.title == album_name).first()
    if not album:
        album = Album(title=album_name or "Unknown", artist_id=artist.id)
        db.add(album)
        db.commit()
        db.refresh(album)
    
    # Create song
    db_song = Song(
        title=title or file.filename,
        artist_id=artist.id,
        album_id=album.id,
        duration=180,  # Default 3 minutes
        file_path=file_path
    )
    db.add(db_song)
    db.commit()
    
    return {"message": "Song uploaded successfully", "song_id": db_song.id}

@router.get("/stream/{song_id}")
def stream_song(song_id: int, db: Session = Depends(get_db)):
    song = db.query(Song).filter(Song.id == song_id).first()
    if not song or not os.path.exists(song.file_path):
        raise HTTPException(status_code=404, detail="Song not found")
    
    return FileResponse(song.file_path, media_type="audio/mpeg", filename=f"{song.title}.mp3")