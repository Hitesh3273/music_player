export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  file_path: string;
  created_at: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  songs: Song[];
  created_at: string;
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: Song[];
  currentIndex: number;
}