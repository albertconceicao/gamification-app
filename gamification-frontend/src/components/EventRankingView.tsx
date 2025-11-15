import { useState, useEffect } from 'react'
import { ArrowLeft, Trophy, Medal, Award, TrendingUp, Users, Calendar, Download } from 'lucide-react'
import { getEventRanking } from '../services/api'
import type { Event, User } from '../types'

interface EventRankingViewProps {
  event: Event
  onBack: () => void
}

export default function EventRankingView({ event, onBack }: EventRankingViewProps) {
  const [ranking, setRanking] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'top10' | 'top50'>('all')

  useEffect(() => {
    loadRanking()
  }, [event._id])

  const loadRanking = async () => {
    try {
      setLoading(true)
      const data = await getEventRanking(event._id)
      setRanking(data.data || [])
    } catch (err) {
      console.error('Error loading ranking:', err)
    } finally {
      setLoading(false)
    }
  }

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="h-8 w-8 text-yellow-500 fill-yellow-500" />
      case 1:
        return <Medal className="h-8 w-8 text-gray-400 fill-gray-400" />
      case 2:
        return <Award className="h-8 w-8 text-orange-600 fill-orange-600" />
      default:
        return null
    }
  }

  const getFilteredRanking = () => {
    switch (filter) {
      case 'top10':
        return ranking.slice(0, 10)
      case 'top50':
        return ranking.slice(0, 50)
      default:
        return ranking
    }
  }

  const filteredRanking = getFilteredRanking()
  const totalPoints = ranking.reduce((sum, user) => sum + user.points, 0)
  const averagePoints = ranking.length > 0 ? Math.round(totalPoints / ranking.length) : 0

  const exportToCSV = () => {
    const headers = ['Position', 'Name', 'Email', 'Points', 'Last Action']
    const rows = ranking.map((user, index) => [
      index + 1,
      user.first_name,
      user.email,
      user.points,
      user.lastAction ? new Date(user.lastAction).toLocaleString('pt-BR') : 'Nenhuma'
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `ranking-${event.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            title="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Event Ranking</h1>
        </div>
        <button
          onClick={exportToCSV}
          disabled={ranking.length === 0}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-5 w-5" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Participants</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{ranking.length}</p>
            </div>
            <Users className="h-12 w-12 text-indigo-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Points</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalPoints.toLocaleString('en-US')}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Points</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{averagePoints.toLocaleString('en-US')}</p>
            </div>
            <Trophy className="h-12 w-12 text-yellow-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-sm font-medium rounded-full ${
            filter === 'all'
              ? 'bg-indigo-100 text-indigo-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('top10')}
          className={`px-3 py-1.5 text-sm font-medium rounded-full ${
            filter === 'top10'
              ? 'bg-indigo-100 text-indigo-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Top 10
        </button>
        <button
          onClick={() => setFilter('top50')}
          className={`px-3 py-1.5 text-sm font-medium rounded-full ${
            filter === 'top50'
              ? 'bg-indigo-100 text-indigo-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Top 50
        </button>
      </div>

      {/* Ranking List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Ranking ({filteredRanking.length} participants)
          </h3>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading ranking...</p>
          </div>
        ) : filteredRanking.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {/* Top 3 - Destaque */}
            {filteredRanking.slice(0, 3).map((user, index) => (
              <div
                key={user._id}
                className={`p-6 ${
                  index === 0
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50'
                    : index === 1
                    ? 'bg-gradient-to-r from-gray-50 to-slate-50'
                    : 'bg-gradient-to-r from-orange-50 to-amber-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md">
                      {getMedalIcon(index)}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500">
                          {index + 1}º
                        </span>
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {user.first_name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                      {user.lastAction && (
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          Last action: {new Date(user.lastAction).toLocaleDateString('en-US')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-4xl font-bold text-indigo-600">{user.points}</p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Resto do ranking */}
            {filteredRanking.slice(3).map((user, index) => {
              const position = index + 3
              return (
                <div
                  key={user._id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                        <span className="text-lg font-bold text-gray-600">
                          #{position + 1}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                        {user.lastAction && (
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            Last action: {new Date(user.lastAction).toLocaleDateString('en-US')}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-2xl font-bold text-indigo-600">{user.points}</p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No participants yet
            </h3>
            <p className="text-gray-600">
              View participant rankings for <span className="font-semibold">{event.name}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
