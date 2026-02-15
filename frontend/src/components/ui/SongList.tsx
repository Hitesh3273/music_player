import { type Song } from '../../types/music';
import { usePlayer } from '../../store/player';

interface SongListProps {
  songs: Song[];
  onPlayAll?: () => void;
}

export function SongList({ songs, onPlayAll }: SongListProps) {
  const { currentSong, isPlaying, play, pause, playQueue } = usePlayer();

  const handleSongClick = (song: Song, index: number) => {
    if (currentSong?.id === song.id) {
      isPlaying ? pause() : play();
    } else {
      playQueue(songs, index);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (songs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No songs found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            {songs.length} song{songs.length !== 1 ? 's' : ''}
          </h3>
          {onPlayAll && (
            <button
              onClick={onPlayAll}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium"
            >
              Play All
            </button>
          )}
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {songs.map((song, index) => (
          <div
            key={song.id}
            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
              currentSong?.id === song.id ? 'bg-indigo-50' : ''
            }`}
            onClick={() => handleSongClick(song, index)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {currentSong?.id === song.id && isPlaying ? (
                    <div className="w-4 h-4 text-indigo-600">⏸️</div>
                  ) : (
                    <div className="w-4 h-4 text-gray-400">▶️</div>
                  )}
                </div>
                <div>
                  <h4 className={`font-medium ${
                    currentSong?.id === song.id ? 'text-indigo-600' : 'text-gray-900'
                  }`}>
                    {song.title}
                  </h4>
                  <p className="text-sm text-gray-500">{song.artist}</p>
                  {song.album && (
                    <p className="text-xs text-gray-400">{song.album}</p>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {formatDuration(song.duration)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}