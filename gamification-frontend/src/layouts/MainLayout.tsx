import { ReactNode } from 'react';
import { Trophy, Users, Target, Award, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type ViewType = 'events' | 'dashboard' | 'admin';

interface MainLayoutProps {
  children: ReactNode;
  currentView: ViewType;
  selectedEvent?: any; // Replace with your Event type
  onSelectEvent?: (event: any) => void;
  onViewChange?: (view: ViewType) => void;
}

export default function MainLayout({
  children,
  currentView,
  selectedEvent,
  onSelectEvent,
  onViewChange,
}: MainLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  if (location.pathname === '/signin' || location.pathname === '/signup') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4 flex flex-col">
        <div className="flex items-center space-x-2 mb-8 p-2">
          <Trophy className="h-8 w-8 text-indigo-600" />
          <h1 className="text-xl font-bold text-gray-800">Gamification</h1>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => onViewChange?.('events')}
            className={`flex items-center space-x-2 w-full px-4 py-2 rounded-lg transition-colors ${
              currentView === 'events' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Trophy className="h-4 w-4" />
            <span>Eventos</span>
          </button>

          {selectedEvent && (
            <button
              onClick={() => onViewChange?.('dashboard')}
              className={`flex items-center space-x-2 w-full px-4 py-2 rounded-lg transition-colors ${
                currentView === 'dashboard' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Target className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
          )}

          {user?.role === 'admin' && (
            <button
              onClick={() => onViewChange?.('admin')}
              className={`flex items-center space-x-2 w-full px-4 py-2 rounded-lg transition-colors ${
                currentView === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Admin</span>
            </button>
          )}
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between px-2 py-2">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-sm font-medium text-indigo-700">
                  {user?.first_name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.first_name || 'Usuário'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}
