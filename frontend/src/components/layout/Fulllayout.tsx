import { Link, Outlet } from '@tanstack/react-router';
import { useAuth } from '../../store/auth';
import { MusicPlayer } from '../player/MusicPlayer';

export function FullLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-900">🎵 Music</h1>
              <nav className="flex space-x-4">
                <Link to="/" className="[&.active]:text-indigo-600 [&.active]:font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link to="/search" className="[&.active]:text-indigo-600 [&.active]:font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Search
                </Link>
                <Link to="/playlists" className="[&.active]:text-indigo-600 [&.active]:font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Playlists
                </Link>
                <Link to="/profile" className="[&.active]:text-indigo-600 [&.active]:font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Profile
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.username}</span>
              <button 
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Music Player */}
      <div className="fixed bottom-0 left-0 right-0">
        <MusicPlayer />
      </div>
    </div>
  );
}
