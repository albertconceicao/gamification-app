import { useState, useEffect } from 'react'
import { Calendar, Users, Target, ChevronRight } from 'lucide-react'
import { getEvents } from '../services/api'
import { Event } from '../types'

interface EventListProps {
  onSelectEvent: (event: Event) => void
}

export default function EventList({ onSelectEvent }: EventListProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const data = await getEvents()
      setEvents(data.data || [])
    } catch (err) {
      setError('Error loading events')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Active Events</h2>
        <p className="text-gray-600">Select an event to view details</p>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">There are no active events at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event._id}
              onClick={() => onSelectEvent(event)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {event.name}
                  </h3>
                  {event.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {event.description}
                    </p>
                  )}
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {new Date(event.startDate).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                  </span>
                </div>

                {event.stats && (
                  <>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{event.stats?.totalUsers || 0} participants</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Target className="h-4 w-4 mr-1" />
                      <span>{event.stats?.totalActions || 0} actions</span>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    event.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {event.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
