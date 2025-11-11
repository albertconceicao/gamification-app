import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Trophy, Medal, Award, Crown, RefreshCw } from 'lucide-react'
import { getEventRanking, getEvent } from '../services/api'
import type { User, Event } from '../types'

export default function EmbedRanking() {
  const { eventId } = useParams<{ eventId: string }>()
  const [searchParams] = useSearchParams()
  const [ranking, setRanking] = useState<User[]>([])
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Parâmetros de customização via query string
  const limit = parseInt(searchParams.get('limit') || '10')
  const theme = searchParams.get('theme') || 'light' // light, dark, custom
  const showEmail = searchParams.get('showEmail') !== 'false'
  const autoRefresh = parseInt(searchParams.get('refresh') || '0') // em segundos
  const title = searchParams.get('title') || ''

  useEffect(() => {
    if (eventId) {
      loadData()
    }
  }, [eventId])

  useEffect(() => {
    if (autoRefresh > 0) {
      const interval = setInterval(() => {
        loadData(true)
      }, autoRefresh * 1000)

      return () => clearInterval(interval)
    }
  }, [autoRefresh, eventId])

  const loadData = async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      setError(null)

      const [rankingData, eventData] = await Promise.all([
        getEventRanking(eventId!),
        getEvent(eventId!)
      ])

      setRanking(rankingData.data || [])
      setEvent(eventData.data)
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Error loading ranking')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500 fill-yellow-500" />
      case 1:
        return <Medal className="h-6 w-6 text-gray-400 fill-gray-400" />
      case 2:
        return <Award className="h-6 w-6 text-orange-600 fill-orange-600" />
      default:
        return null
    }
  }

  const limitedRanking = ranking.slice(0, limit)

  // Temas
  const themes = {
    light: {
      bg: 'bg-white',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-gray-200',
      podium1: 'bg-gradient-to-r from-yellow-50 to-orange-50',
      podium2: 'bg-gradient-to-r from-gray-50 to-slate-50',
      podium3: 'bg-gradient-to-r from-orange-50 to-amber-50',
      item: 'bg-gray-50 hover:bg-gray-100'
    },
    dark: {
      bg: 'bg-gray-900',
      text: 'text-white',
      textSecondary: 'text-gray-400',
      border: 'border-gray-700',
      podium1: 'bg-gradient-to-r from-yellow-900 to-orange-900',
      podium2: 'bg-gradient-to-r from-gray-800 to-slate-800',
      podium3: 'bg-gradient-to-r from-orange-900 to-amber-900',
      item: 'bg-gray-800 hover:bg-gray-700'
    },
    custom: {
      bg: 'bg-transparent',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-gray-200',
      podium1: 'bg-gradient-to-r from-yellow-50 to-orange-50',
      podium2: 'bg-gradient-to-r from-gray-50 to-slate-50',
      podium3: 'bg-gradient-to-r from-orange-50 to-amber-50',
      item: 'bg-white/50 hover:bg-white/70'
    }
  }

  const currentTheme = themes[theme as keyof typeof themes] || themes.light

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${currentTheme.bg}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className={`mt-4 ${currentTheme.textSecondary}`}>Loading ranking...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${currentTheme.bg}`}>
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => loadData()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen p-4 ${currentTheme.bg}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Trophy className="h-8 w-8 text-indigo-600" />
            <h1 className={`text-3xl font-bold ${currentTheme.text}`}>
              {title || 'Ranking'}
            </h1>
          </div>
          {event && (
            <p className={`text-lg ${currentTheme.textSecondary}`}>{event.name}</p>
          )}
          {autoRefresh > 0 && (
            <div className="flex items-center justify-center space-x-2 mt-2">
              <RefreshCw className={`h-4 w-4 ${currentTheme.textSecondary}`} />
              <p className={`text-sm ${currentTheme.textSecondary}`}>
                Auto-refresh every {autoRefresh}s
              </p>
            </div>
          )}
        </div>

        {/* Ranking */}
        {ranking.length === 0 ? (
          <div className={`text-center py-12 ${currentTheme.bg} rounded-lg border ${currentTheme.border}`}>
            <Trophy className={`h-16 w-16 mx-auto mb-4 ${currentTheme.textSecondary}`} />
            <p className={currentTheme.textSecondary}>No participants yet</p>
          </div>
        ) : (
          <div className={`rounded-lg border ${currentTheme.border} overflow-hidden`}>
            {limitedRanking.map((user, index) => {
              const isPodium = index < 3
              const bgClass = isPodium
                ? index === 0
                  ? currentTheme.podium1
                  : index === 1
                  ? currentTheme.podium2
                  : currentTheme.podium3
                : currentTheme.item

              return (
                <div
                  key={user._id}
                  className={`p-4 border-b ${currentTheme.border} last:border-b-0 transition-colors ${bgClass}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Position/Medal */}
                      <div className="flex items-center justify-center w-12 h-12">
                        {getMedalIcon(index) || (
                          <span className={`text-xl font-bold ${currentTheme.text}`}>
                            #{index + 1}
                          </span>
                        )}
                      </div>

                      {/* User Info */}
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className={`font-bold ${isPodium ? 'text-xl' : 'text-lg'} ${currentTheme.text}`}>
                            {user.name}
                          </p>
                          {index === 0 && (
                            <Crown className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        {showEmail && (
                          <p className={`text-sm ${currentTheme.textSecondary}`}>
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <p className={`font-bold text-indigo-600 ${isPodium ? 'text-3xl' : 'text-2xl'}`}>
                        {user.points}
                      </p>
                      <p className={`text-xs ${currentTheme.textSecondary}`}>points</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer Info */}
        {ranking.length > limit && (
          <p className={`text-center mt-4 text-sm ${currentTheme.textSecondary}`}>
            Showing top {limit} of {ranking.length} participants
          </p>
        )}
      </div>
    </div>
  )
}
