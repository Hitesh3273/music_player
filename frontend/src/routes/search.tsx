import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import {type Song } from '../types/music';
import { musicService } from '../services/music';
import { SongList } from '../components/ui/SongList';
import { usePlayer } from '../store/player';

export const Route = createFileRoute('/search')({
  component: SearchPage,
});

function SearchPage() {
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const { playQueue } = usePlayer();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const results = await musicService.searchSongs(query);
      setSongs(results);
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playQueue(songs);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔍 Search Music</h1>
        <p className="text-gray-600">Find your favorite songs and artists</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex space-x-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for songs, artists, or albums..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && (
        <div className="text-center">
          <div className="text-red-600">{error}</div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {!loading && hasSearched && (
        <div>
          {songs.length > 0 ? (
            <SongList songs={songs} onPlayAll={handlePlayAll} />
          ) : (
            <div className="text-center py-12 text-gray-500">
              No songs found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}