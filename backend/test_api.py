import requests
import json

BASE_URL = "http://localhost:8000"

def test_api():
    print("🎵 Testing Music Streaming API...")
    
    # Test registration
    print("\n1. Testing user registration...")
    register_data = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        if response.status_code == 200:
            token = response.json()["access_token"]
            print("✅ Registration successful!")
            
            # Test adding a song
            print("\n2. Testing song creation...")
            song_data = {
                "title": "Test Song",
                "artist_name": "Test Artist",
                "album_name": "Test Album",
                "duration": 210
            }
            
            response = requests.post(f"{BASE_URL}/songs/", json=song_data)
            if response.status_code == 200:
                print("✅ Song created successfully!")
                
                # Test creating playlist
                print("\n3. Testing playlist creation...")
                headers = {"Authorization": f"Bearer {token}"}
                playlist_data = {"name": "My Test Playlist"}
                
                response = requests.post(f"{BASE_URL}/playlists/", json=playlist_data, headers=headers)
                if response.status_code == 200:
                    print("✅ Playlist created successfully!")
                    print("\n🎉 All tests passed! Your API is working!")
                else:
                    print(f"❌ Playlist creation failed: {response.text}")
            else:
                print(f"❌ Song creation failed: {response.text}")
        else:
            print(f"❌ Registration failed: {response.text}")
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API. Make sure server is running on http://localhost:8000")

if __name__ == "__main__":
    test_api()