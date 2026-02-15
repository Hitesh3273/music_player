import { memo, useMemo, useState } from "react";
import { type Song } from "../../types/music";
import { usePlayer } from "../../store/player";

interface SongListProps {
  songs: Song[];
  showHeader?: boolean;
  showPlayAll?: boolean;
  className?: string;
  onSongSelect?: (song: Song, index: number) => void;
}

export const SongList = memo(function SongList({
  songs,
  showHeader = true,
  showPlayAll = true,
  className = "",
  onSongSelect,
}: SongListProps) {
  const { currentSong, isPlaying, play, pause, playQueue } = usePlayer();
  const [hoveredSong, setHoveredSong] = useState<string | null>(null);

  const formatDuration = useMemo(
    () => (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    },
    [],
  );

  const handleSongClick = (song: Song, index: number) => {
    onSongSelect?.(song, index);

    if (currentSong?.id === song.id) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    } else {
      playQueue(songs, index);
    }
  };

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playQueue(songs, 0);
    }
  };

  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <svg
          className="w-12 h-12 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
        <p>No songs available</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between p-4 border-b bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">
            {songs.length} song{songs.length !== 1 ? "s" : ""}
          </h3>
          {showPlayAll && (
            <button
              onClick={handlePlayAll}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              Play All
            </button>
          )}
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {songs.map((song, index) => {
          const isCurrentSong = currentSong?.id === song.id;
          const isHovered = hoveredSong === song.id;

          return (
            <div
              key={song.id}
              className={`group flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-all duration-150 ${
                isCurrentSong ? "bg-indigo-50 border-l-4 border-indigo-500" : ""
              }`}
              onClick={() => handleSongClick(song, index)}
              onMouseEnter={() => setHoveredSong(song.id)}
              onMouseLeave={() => setHoveredSong(null)}
            >
              <div className="flex items-center justify-center w-10 h-10 mr-4 flex-shrink-0">
                {isCurrentSong && isPlaying ? (
                  <div className="flex items-center justify-center w-6 h-6 text-indigo-600">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : isHovered || isCurrentSong ? (
                  <div className="flex items-center justify-center w-6 h-6 text-indigo-600">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400 font-medium">
                    {index + 1}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4
                  className={`font-medium truncate ${
                    isCurrentSong ? "text-indigo-600" : "text-gray-900"
                  }`}
                >
                  {song.title}
                </h4>
                <p className="text-sm text-gray-500 truncate">{song.artist}</p>
                {song.album && (
                  <p className="text-xs text-gray-400 truncate">{song.album}</p>
                )}
              </div>

              <div className="flex items-center gap-4 ml-4">
                <span className="text-sm text-gray-500 tabular-nums">
                  {formatDuration(song.duration)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
