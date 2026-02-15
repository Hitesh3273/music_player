import { type Song, type Playlist } from '../types/music';

const API_BASE = 'http://localhost:8000';

class MusicService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getSongs(): Promise<Song[]> {
    const response = await fetch(`${API_BASE}/songs/`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch songs');
    return response.json();
  }

  async searchSongs(query: string): Promise<Song[]> {
    const response = await fetch(`${API_BASE}/songs/search?q=${encodeURIComponent(query)}`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to search songs');
    return response.json();
  }

  async getPlaylists(): Promise<Playlist[]> {
    const response = await fetch(`${API_BASE}/playlists/`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch playlists');
    return response.json();
  }

  async createPlaylist(name: string, description?: string): Promise<Playlist> {
    const response = await fetch(`${API_BASE}/playlists/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ name, description }),
    });
    if (!response.ok) throw new Error('Failed to create playlist');
    return response.json();
  }

  async addSongToPlaylist(playlistId: string, songId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/playlists/${playlistId}/songs/${songId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to add song to playlist');
  }

  getStreamUrl(songId: string): string {
    return `${API_BASE}/songs/stream/${songId}`;
  }
}

export const musicService = new MusicService();