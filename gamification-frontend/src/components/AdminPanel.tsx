import { useState, useEffect } from 'react'
import { Plus, Calendar, Edit, Trash2, ToggleLeft, ToggleRight, Target, Trophy, Code } from 'lucide-react'
import { getEvents, updateEvent } from '../services/api'
import type { Event } from '../types'
import EventForm from './EventForm'
import EventActionsManager from './EventActionsManager'
import EventRankingView from './EventRankingView'
import EmbedCodeModal from './EmbedCodeModal'

export default function AdminPanel() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [managingActionsEvent, setManagingActionsEvent] = useState<Event | null>(null)
  const [viewingRankingEvent, setViewingRankingEvent] = useState<Event | null>(null)
  const [embedCodeEvent, setEmbedCodeEvent] = useState<Event | null>(null)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const data = await getEvents()
      console.log(data)
      setEvents(data.data || [])
    } catch (err) {
      console.error('Erro ao carregar eventos:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEventSaved = (savedEvent: Event) => {
    if (editingEvent) {
      // Modo edição: atualiza o evento existente
      setEvents(prev =>
        prev.map(e => e._id === savedEvent._id ? savedEvent : e)
      )
    } else {
      // Modo criação: adiciona novo evento
      setEvents(prev => [savedEvent, ...prev])
    }
  }

  const handleToggleActive = async (event: Event) => {
    try {
      const response = await updateEvent(event._id, {
        isActive: !event.isActive
      })
      
      if (response.success) {
        setEvents(prev =>
          prev.map(e => e._id === event._id ? { ...e, isActive: !e.isActive } : e)
        )
      }
    } catch (err) {
      console.error('Erro ao atualizar evento:', err)
      alert('Erro ao atualizar status do evento')
    }
  }

  // Se estiver gerenciando ações, mostra o gerenciador
  if (managingActionsEvent) {
    return (
      <EventActionsManager
        event={managingActionsEvent}
        onBack={() => setManagingActionsEvent(null)}
      />
    )
  }

  // Se estiver visualizando ranking, mostra a tela de ranking
  if (viewingRankingEvent) {
    return (
      <EventRankingView
        event={viewingRankingEvent}
        onBack={() => setViewingRankingEvent(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Painel Administrativo</h2>
          <p className="text-gray-600 mt-1">Gerencie eventos e configurações</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          <Plus className="h-5 w-5" />
          <span>Novo Evento</span>
        </button>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
            Eventos ({events.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Carregando eventos...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum evento criado
            </h3>
            <p className="text-gray-600 mb-6">
              Comece criando seu primeiro evento
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Plus className="h-5 w-5" />
              <span>Criar Primeiro Evento</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {events.map((event) => (
              <div key={event._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {event.name}
                      </h4>
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
                    
                    {event.description && (
                      <p className="text-gray-600 mb-3">{event.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>
                        Início: {new Date(event.startDate).toLocaleDateString('pt-BR')}
                      </span>
                      {event.endDate && (
                        <span>
                          Término: {new Date(event.endDate).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                      {event.stats && (
                        <>
                          <span>• {event.stats.totalUsers || 0} participantes</span>
                          <span>• {event.stats.totalActions || 0} ações</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setEmbedCodeEvent(event)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Código de incorporação"
                    >
                      <Code className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={() => setViewingRankingEvent(event)}
                      className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      title="Ver ranking"
                    >
                      <Trophy className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={() => setManagingActionsEvent(event)}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Gerenciar ações"
                    >
                      <Target className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={() => handleToggleActive(event)}
                      className={`p-2 rounded-lg transition-colors ${
                        event.isActive
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={event.isActive ? 'Desativar evento' : 'Ativar evento'}
                    >
                      {event.isActive ? (
                        <ToggleRight className="h-5 w-5" />
                      ) : (
                        <ToggleLeft className="h-5 w-5" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => setEditingEvent(event)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Editar evento"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    
                    <button
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir evento"
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

      {/* Event Form Modal (Create/Edit) */}
      {(showCreateForm || editingEvent) && (
        <EventForm
          event={editingEvent || undefined}
          onClose={() => {
            setShowCreateForm(false)
            setEditingEvent(null)
          }}
          onEventSaved={handleEventSaved}
        />
      )}

      {/* Embed Code Modal */}
      {embedCodeEvent && (
        <EmbedCodeModal
          event={embedCodeEvent}
          onClose={() => setEmbedCodeEvent(null)}
        />
      )}
    </div>
  )
}
