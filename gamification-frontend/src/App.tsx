import { useState, useEffect } from 'react'
import { Trophy, Users, Target, Award } from 'lucide-react'
import EventList from './components/EventList'
import EventDashboard from './components/EventDashboard'
import AdminPanel from './components/AdminPanel'
import type { Event, User } from './types'
import './App.css'

type ViewType = 'events' | 'dashboard' | 'admin'

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('events')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Carregar usuário do localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event)
    setCurrentView('dashboard')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
    localStorage.removeItem('userId')
    setCurrentView('events')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Gamification System
                </h1>
                <p className="text-sm text-gray-500">
                  Manage events and score actions
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {currentUser && (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentUser.points} pontos
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-4 flex space-x-4">
            <button
              onClick={() => setCurrentView('events')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentView === 'events'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Target className="h-4 w-4" />
              <span>Eventos</span>
            </button>

            {selectedEvent && (
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Award className="h-4 w-4" />
                <span>{selectedEvent.name}</span>
              </button>
            )}

            <button
              onClick={() => setCurrentView('admin')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentView === 'admin'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Admin</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'events' && (
          <EventList onSelectEvent={handleSelectEvent} />
        )}

        {currentView === 'dashboard' && selectedEvent && (
          <EventDashboard
            event={selectedEvent}
            currentUser={currentUser}
            onUserUpdate={setCurrentUser}
          />
        )}

        {currentView === 'admin' && <AdminPanel />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Gamification System v2.0 - API + React Frontend
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
