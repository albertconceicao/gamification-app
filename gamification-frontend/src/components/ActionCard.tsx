import { Star, Lock, CheckCircle } from 'lucide-react'
import { Action } from '../types'

interface ActionCardProps {
  action: Action
  onPerform: (actionId: string) => void
  disabled: boolean
}

export default function ActionCard({ action, onPerform, disabled }: ActionCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${
      !action.isActive ? 'opacity-60' : ''
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{action.name}</h4>
          {action.description && (
            <p className="text-sm text-gray-600 mt-1">{action.description}</p>
          )}
        </div>
        <Star className="h-5 w-5 text-yellow-500" />
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-2xl font-bold text-indigo-600">
          +{action.points} pts
        </div>
        
        <button
          onClick={() => onPerform(action._id)}
          disabled={disabled || !action.isActive}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            disabled || !action.isActive
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {disabled ? <Lock className="h-4 w-4" /> : 'Realizar'}
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          {action.allowMultiple ? (
            <span className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              Pode repetir
            </span>
          ) : (
            'Apenas uma vez'
          )}
        </span>
      </div>
    </div>
  )
}
