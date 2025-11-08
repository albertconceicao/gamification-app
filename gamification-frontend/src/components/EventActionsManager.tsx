import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Target, Edit, Trash2, ToggleLeft, ToggleRight, Star, Repeat, Ban } from 'lucide-react'
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
      setActions(data.data || [])
    } catch (err) {
      console.error('Erro ao carregar ações:', err)
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
      console.error('Erro ao atualizar ação:', err)
      alert('Erro ao atualizar status da ação')
    }
  }

  const handleDelete = async (action: Action) => {
    if (!confirm(`Tem certeza que deseja excluir a ação "${action.name}"?`)) {
      return
    }

    try {
      const response = await deleteAction(action._id)
      
      if (response.success) {
        setActions(prev => prev.filter(a => a._id !== action._id))
      }
    } catch (err) {
      console.error('Erro ao excluir ação:', err)
      alert('Erro ao excluir ação')
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
            <h2 className="text-2xl font-bold text-gray-900">Gerenciar Ações</h2>
            <p className="text-gray-600 mt-1">Evento: {event.name}</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          <Plus className="h-5 w-5" />
          <span>Nova Ação</span>
        </button>
      </div>

      {/* Actions List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Target className="h-5 w-5 mr-2 text-indigo-600" />
            Ações ({actions.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Carregando ações...</p>
          </div>
        ) : actions.length === 0 ? (
          <div className="p-12 text-center">
            <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma ação criada
            </h3>
            <p className="text-gray-600 mb-6">
              Comece criando ações para os participantes ganharem pontos
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Plus className="h-5 w-5" />
              <span>Criar Primeira Ação</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {actions.map((action) => (
              <div key={action._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {action.name}
                      </h4>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          action.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {action.isActive ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                    
                    {action.description && (
                      <p className="text-gray-600 mb-3">{action.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center text-indigo-600 font-semibold">
                        <Star className="h-4 w-4 mr-1 fill-current" />
                        <span>{action.points} pontos</span>
                      </div>
                      
                      {action.allowMultiple ? (
                        <div className="flex items-center text-green-600">
                          <Repeat className="h-4 w-4 mr-1" />
                          <span>Permite múltiplas</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-500">
                          <Ban className="h-4 w-4 mr-1" />
                          <span>Única vez</span>
                        </div>
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
                      title={action.isActive ? 'Desativar ação' : 'Ativar ação'}
                    >
                      {action.isActive ? (
                        <ToggleRight className="h-5 w-5" />
                      ) : (
                        <ToggleLeft className="h-5 w-5" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setEditingAction(action)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Editar ação"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(action)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir ação"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
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
