import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { type Playlist } from '../types/music';
import { musicService } from '../services/music';
import { SongList } from '../components/ui/SongList';
import { usePlayer } from '../store/player';

export const Route = createFileRoute('/playlists')({
  component: PlaylistsPage,
});

function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const { playQueue } = usePlayer();

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const data = await musicService.getPlaylists();
      setPlaylists(data);
    } catch {
      setError('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      const newPlaylist = await musicService.createPlaylist(
        newPlaylistName,
        newPlaylistDescription || undefined
      );
      setPlaylists([...playlists, newPlaylist]);
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      setShowCreateForm(false);
    } catch {
      setError('Failed to create playlist');
    }
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    if (playlist.songs.length > 0) {
      playQueue(playlist.songs);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📋 My Playlists</h1>
          <p className="text-gray-600">Organize your favorite songs</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium"
        >
          Create Playlist
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-medium mb-4">Create New Playlist</h3>
          <form onSubmit={handleCreatePlaylist} className="space-y-4">
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Playlist name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <textarea
              value={newPlaylistDescription}
              onChange={(e) => setNewPlaylistDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
            />
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Playlists</h2>
          {playlists.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No playlists yet. Create your first playlist!
            </div>
          ) : (
            <div className="space-y-3">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className={`p-4 bg-white rounded-lg shadow border cursor-pointer transition-colors ${
                    selectedPlaylist?.id === playlist.id ? 'border-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPlaylist(playlist)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{playlist.name}</h3>
                      {playlist.description && (
                        <p className="text-sm text-gray-500">{playlist.description}</p>
                      )}
                      <p className="text-xs text-gray-400">
                        {playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayPlaylist(playlist);
                      }}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium"
                      disabled={playlist.songs.length === 0}
                    >
                      Play
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {selectedPlaylist ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{selectedPlaylist.name}</h2>
                {selectedPlaylist.songs.length > 0 && (
                  <button
                    onClick={() => handlePlayPlaylist(selectedPlaylist)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium"
                  >
                    Play All
                  </button>
                )}
              </div>
              <SongList songs={selectedPlaylist.songs} />
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Select a playlist to view its songs
            </div>
          )}
        </div>
      </div>
    </div>
  );
}