import { useState, useEffect } from 'react'
import { Trophy, Star, Clock, Plus } from 'lucide-react'
import { getEventActions, getEventRanking, registerUser, performAction, getUser } from '../services/api'
import type { Event, User, Action } from '../types'
import RegistrationForm from './RegistrationForm'
import ActionCard from './ActionCard'
import Ranking from './Ranking'
import ActionForm from './ActionForm'

interface EventDashboardProps {
  event: Event
  currentUser: User | null
  onUserUpdate: (user: User) => void
}

export default function EventDashboard({ event, currentUser, onUserUpdate }: EventDashboardProps) {
  const [actions, setActions] = useState<Action[]>([])
  const [ranking, setRanking] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showRegistration, setShowRegistration] = useState(!currentUser)
  const [showCreateAction, setShowCreateAction] = useState(false)

  useEffect(() => {
    loadEventData()
  }, [event._id])

  useEffect(() => {
    setShowRegistration(!currentUser)
  }, [currentUser])

  const loadEventData = async () => {
    try {
      setLoading(true)
      const [actionsData, rankingData] = await Promise.all([
        getEventActions(event._id),
        getEventRanking(event._id)
      ])
      setActions(actionsData.data || [])
      setRanking(rankingData.data || [])
    } catch (err) {
      console.error('Erro ao carregar dados do evento:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (userData: { name: string; email: string }) => {
    try {
      const response = await registerUser(event._id, userData)
      if (response.success && response.data) {
        const user = response.data
        onUserUpdate(user)
        localStorage.setItem('currentUser', JSON.stringify(user))
        localStorage.setItem('userId', user._id)
        setShowRegistration(false)
        await loadEventData()
      }
    } catch (err: any) {
      console.error('Erro ao registrar:', err)
      alert(err.response?.data?.message || 'Erro ao registrar usuário')
    }
  }

  const handlePerformAction = async (actionId: string) => {
    if (!currentUser) {
      alert('Você precisa estar registrado para realizar ações')
      return
    }

    try {
      const response = await performAction(currentUser._id, actionId)
      if (response.success) {
        // Atualizar dados do usuário
        const userData = await getUser(currentUser._id)
        if (userData.success) {
          onUserUpdate(userData.data)
          localStorage.setItem('currentUser', JSON.stringify(userData.data))
        }
        
        // Recarregar ranking
        await loadEventData()
        
        alert(`✅ ${response.message}`)
      }
    } catch (err: any) {
      console.error('Erro ao realizar ação:', err)
      alert(err.response?.data?.message || 'Erro ao realizar ação')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Event Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">{event.name}</h2>
        {event.description && (
          <p className="text-indigo-100 mb-4">{event.description}</p>
        )}
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>Início: {new Date(event.startDate).toLocaleDateString('pt-BR')}</span>
          </div>
          {event.endDate && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>Término: {new Date(event.endDate).toLocaleDateString('pt-BR')}</span>
            </div>
          )}
        </div>
      </div>

      {/* User Stats */}
      {currentUser && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Seus Pontos</h3>
              <p className="text-3xl font-bold text-indigo-600 mt-2">
                {currentUser.points} pts
              </p>
            </div>
            <Trophy className="h-16 w-16 text-indigo-600 opacity-20" />
          </div>
        </div>
      )}

      {/* Registration Form */}
      {showRegistration && (
        <RegistrationForm onRegister={handleRegister} eventName={event.name} />
      )}

      {/* Actions Grid */}
      {!showRegistration && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              Ações Disponíveis
            </h3>
            <button
              onClick={() => setShowCreateAction(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Ação</span>
            </button>
          </div>
          {actions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Nenhuma ação disponível ainda</p>
              <button
                onClick={() => setShowCreateAction(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                <Plus className="h-5 w-5" />
                <span>Criar Primeira Ação</span>
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {actions.map((action) => (
                <ActionCard
                  key={action._id}
                  action={action}
                  onPerform={handlePerformAction}
                  disabled={!currentUser}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ranking */}
      <Ranking ranking={ranking} currentUserId={currentUser?._id} />

      {/* Create Action Modal */}
      {showCreateAction && (
        <ActionForm
          eventId={event._id}
          eventName={event.name}
          onClose={() => setShowCreateAction(false)}
          onActionSaved={loadEventData}
        />
      )}
    </div>
  )
}
