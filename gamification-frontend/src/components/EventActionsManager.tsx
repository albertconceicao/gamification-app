import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Target, Edit, Trash2, ToggleLeft, ToggleRight, Ban } from 'lucide-react'
import { getEventActions, updateAction, deleteAction } from '../services/api'
import type { Event, Action } from '../types'
import ActionForm from './ActionForm'

interface EventActionsManagerProps {
  event: Event
  onBack: () => void
}

export default function EventActionsManager({ event, onBack }: EventActionsManagerProps) {
  const [actions, setActions] = useState<Action[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAction, setEditingAction] = useState<Action | null>(null)

  useEffect(() => {
    loadActions()
  }, [event._id])

  const loadActions = async () => {
    try {
      setLoading(true)
      const data = await getEventActions(event._id)
        console.log({data})
      setActions(data.data || [])
    } catch (err) {
      console.error('Error loading actions:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleActionSaved = () => {
    loadActions()
  }

  const handleToggleActive = async (action: Action) => {
    try {
      const response = await updateAction(action._id, {
        isActive: !action.isActive
      })
      
      if (response.success) {
        setActions(prev =>
          prev.map(a => a._id === action._id ? { ...a, isActive: !a.isActive } : a)
        )
      }
    } catch (err) {
      console.error('Error updating action:', err)
      alert('Error updating action status')
    }
  }

  const handleDelete = async (action: Action) => {
    if (!confirm(`Are you sure you want to delete the action "${action.name}"?`)) {
      return
    }

    try {
      const response = await deleteAction(action._id)
      
      if (response.success) {
        setActions(prev => prev.filter(a => a._id !== action._id))
      }
    } catch (err) {
      console.error('Error deleting action:', err)
      alert('Error deleting action')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Actions</h1>
            <p className="text-gray-600">Available actions for event <span className="font-semibold">{event.name}</span></p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          <Plus className="h-5 w-5" />
          <span>New Action</span>
        </button>
      </div>

      {/* Actions List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Target className="h-5 w-5 mr-2 text-indigo-600" />
            Actions ({actions.length})
          </h3>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading actions...</p>
          </div>
        ) : actions.length === 0 ? (
          <div className="p-12 text-center">
            <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No actions created
            </h3>
            <p className="text-gray-600 mb-6">
              Start creating actions for participants to earn points
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Action
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {actions.map((action) => (
              <div key={action._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{action.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{action.description || 'No description'}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      action.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {action.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Target className="h-4 w-4 text-indigo-600 mr-1" />
                    <span className="text-sm font-medium text-gray-900">{action.points}</span>
                    <span className="ml-1 text-sm text-gray-500">pts</span>
                  </div>
                  {action.allowMultiple && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Ban className="h-4 w-4 mr-1" />
                      Multiple
                    </div>
                  )}
                  <div className="flex items-center">
                    {action.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleToggleActive(action)}
                    className={`p-2 rounded-lg transition-colors ${
                      action.isActive
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={action.isActive ? 'Deactivate action' : 'Activate action'}
                  >
                    {action.isActive ? (
                      <ToggleRight className="h-5 w-5" />
                    ) : (
                      <ToggleLeft className="h-5 w-5" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      setEditingAction(action)
                      setShowForm(true)
                    }}
                    className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                    title="Edit action"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(action)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete action"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Form Modal (Create/Edit) */}
      {(showForm || editingAction) && (
        <ActionForm
          eventId={event._id}
          eventName={event.name}
          action={editingAction || undefined}
          handle={editingAction?.handle || ''}
          onClose={() => {
            setShowForm(false)
            setEditingAction(null)
          }}
          onActionSaved={handleActionSaved}
        />
      )}
    </div>
  )
}
