from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Playlist, Song, User
from app.auth import get_current_user
from pydantic import BaseModel
from typing import List

router = APIRouter()

class PlaylistCreate(BaseModel):
    name: str

class PlaylistResponse(BaseModel):
    id: int
    name: str
    songs_count: int
    
    class Config:
        from_attributes = True

@router.post("/", response_model=PlaylistResponse)
def create_playlist(playlist: PlaylistCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_playlist = Playlist(name=playlist.name, user_id=current_user.id)
    db.add(db_playlist)
    db.commit()
    db.refresh(db_playlist)
    
    return PlaylistResponse(
        id=db_playlist.id,
        name=db_playlist.name,
        songs_count=0
    )

@router.get("/", response_model=List[PlaylistResponse])
def get_playlists(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    playlists = db.query(Playlist).filter(Playlist.user_id == current_user.id).all()
    return [
        PlaylistResponse(
            id=playlist.id,
            name=playlist.name,
            songs_count=len(playlist.songs)
        ) for playlist in playlists
    ]

@router.post("/{playlist_id}/songs/{song_id}")
def add_song_to_playlist(playlist_id: int, song_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    playlist = db.query(Playlist).filter(Playlist.id == playlist_id, Playlist.user_id == current_user.id).first()
    song = db.query(Song).filter(Song.id == song_id).first()
    
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    
    playlist.songs.append(song)
    db.commit()
    
    return {"message": "Song added to playlist"}