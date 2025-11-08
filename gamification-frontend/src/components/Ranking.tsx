import { Trophy, Medal, Award } from 'lucide-react'
import type { User } from '../types'

interface RankingProps {
  ranking: User[]
  currentUserId?: string
}

export default function Ranking({ ranking, currentUserId }: RankingProps) {
  const getMedalIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 2:
        return <Award className="h-6 w-6 text-orange-600" />
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <Trophy className="h-6 w-6 text-indigo-600 mr-2" />
        Ranking
      </h3>

      {ranking.length === 0 ? (
        <p className="text-gray-600 text-center py-8">
          Nenhum participante ainda
        </p>
      ) : (
        <div className="space-y-3">
          {ranking.map((user, index) => (
            <div
              key={user._id}
              className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                user._id === currentUserId
                  ? 'bg-indigo-50 border-2 border-indigo-200'
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10">
                  {getMedalIcon(index) || (
                    <span className="text-lg font-bold text-gray-600">
                      #{index + 1}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {user.name}
                    {user._id === currentUserId && (
                      <span className="ml-2 text-xs text-indigo-600 font-semibold">
                        (Você)
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-indigo-600">
                  {user.points}
                </p>
                <p className="text-xs text-gray-500">pontos</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
