import { useEffect, useState } from 'react';
import { type Song } from '../../types/music';
import { musicService } from '../../services/music';
import { SongList } from '../../components/playlist';
import { usePlayer } from '../../store/player';

export function HomePage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { playQueue, currentSong, isPlaying } = usePlayer();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await musicService.getSongs();
        setSongs(data);
      } catch {
        setError('Failed to load songs');
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playQueue(songs);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 px-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-600 mx-auto"></div>
            <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 border-4 border-purple-200 rounded-full animate-ping opacity-20 mx-auto"></div>
          </div>
          <p className="mt-4 text-sm sm:text-base text-gray-600 animate-pulse">Loading your music...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 px-4">
        <div className="text-center animate-fadeIn max-w-sm">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-red-600 mb-4 font-medium text-sm sm:text-base">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
          <div className="animate-fadeInUp max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent leading-tight">
              🎵 Your Music Universe
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-indigo-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Discover, play, and enjoy your favorite tracks in a whole new way
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-indigo-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>{songs.length} Songs Available</span>
              </div>
              {currentSong && (
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-400 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span>{isPlaying ? 'Now Playing' : 'Paused'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Floating Music Notes Animation - Hidden on mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute text-white opacity-10 animate-float"
              style={{
                left: `${20 + i * 15}%`,
                animationDelay: `${i * 0.5}s`,
                fontSize: `${1.5 + Math.random()}rem`
              }}
            >
              ♪
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="animate-slideInUp">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Your Library</h2>
              <p className="text-sm sm:text-base text-gray-600">All your music in one place</p>
            </div>
            <button
              onClick={handlePlayAll}
              className="group flex items-center justify-center gap-2 sm:gap-3 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg sm:rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 text-sm sm:text-base w-full sm:w-auto"
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white bg-opacity-20 flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="hidden sm:inline">Shuffle All</span>
              <span className="sm:hidden">Play All</span>
            </button>
          </div>
          
          <div className="animate-fadeIn">
            <SongList songs={songs} showHeader={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
