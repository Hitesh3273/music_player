import { usePlayer } from '../../store/player';

export function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    play,
    pause,
    setVolume,
    seekTo,
    nextSong,
    prevSong,
  } = usePlayer();

  if (!currentSong) {
    return (
      <div className="flex items-center justify-center h-16 text-gray-500">
        No song selected
      </div>
    );
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = (parseFloat(e.target.value) / 100) * duration;
    seekTo(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value) / 100);
  };

  return (
    <div className="bg-white border-t shadow-lg p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Song Info */}
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
            🎵
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{currentSong.title}</h4>
            <p className="text-sm text-gray-500">{currentSong.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center space-y-2 flex-2">
          <div className="flex items-center space-x-4">
            <button
              onClick={prevSong}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              ⏮️
            </button>
            <button
              onClick={isPlaying ? pause : () => play()}
              className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full"
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button
              onClick={nextSong}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              ⏭️
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center space-x-2 w-full max-w-md">
            <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-500">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <span className="text-sm">🔊</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}