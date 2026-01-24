# 🎵 Music Streaming Platform

A Spotify-like music streaming platform built with FastAPI (Backend) and React + TypeScript (Frontend).

## 🚀 Backend Setup

### Prerequisites
- Python 3.8+
- pip

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Music/backend
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Set environment variables**
```bash
# Create .env file
echo "SECRET_KEY=your-super-secret-key-change-this-in-production" > .env
```

4. **Run the server**
```bash
uvicorn main:app --reload
```

5. **Test the API**
- Visit: http://localhost:8000/docs
- Or run: `python test_api.py`

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Songs
- `GET /songs/` - Get all songs
- `POST /songs/` - Add new song
- `POST /songs/upload` - Upload audio file
- `GET /songs/stream/{song_id}` - Stream audio
- `GET /songs/search?q=query` - Search songs

### Playlists
- `GET /playlists/` - Get user playlists
- `POST /playlists/` - Create playlist
- `POST /playlists/{id}/songs/{song_id}` - Add song to playlist

## 🛠 Tech Stack
- **Backend**: FastAPI, SQLAlchemy, SQLite
- **Authentication**: JWT tokens
- **File Storage**: Local file system

## 📁 Project Structure
```
backend/
├── main.py              # FastAPI app
├── requirements.txt     # Dependencies
├── test_api.py         # API tests
└── app/
    ├── models.py       # Database models
    ├── database.py     # DB connection
    ├── auth.py         # JWT utilities
    └── routers/        # API endpoints
```

## 🔄 Next Steps
- [ ] Frontend with React + TypeScript
- [ ] Cloud storage for audio files
- [ ] Real-time features
- [ ] Mobile app