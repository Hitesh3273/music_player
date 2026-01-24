from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, songs, playlists
from app.database import engine
from app import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Music Streaming API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(songs.router, prefix="/songs", tags=["songs"])
app.include_router(playlists.router, prefix="/playlists", tags=["playlists"])

@app.get("/")
def root():
    return {"message": "Music Streaming API"}