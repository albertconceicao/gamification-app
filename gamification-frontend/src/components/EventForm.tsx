import { useState } from 'react'
import { Calendar, X, Save, AlertCircle } from 'lucide-react'
import { createEvent, updateEvent } from '../services/api'
import type { CreateEventData, UpdateEventData, Event } from '../types'

interface EventFormProps {
  event?: Event // Se fornecido, é modo edição; caso contrário, é criação
  onClose: () => void
  onEventSaved: (event: Event) => void
}

export default function EventForm({ event, onClose, onEventSaved }: EventFormProps) {
  const isEditMode = !!event
  
  const [formData, setFormData] = useState<CreateEventData | UpdateEventData>({
    name: event?.name || '',
    description: event?.description || '',
    startDate: event?.startDate ? new Date(event.startDate).toISOString().split('T')[0] : '',
    endDate: event?.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
    isActive: event?.isActive ?? true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name?.trim()) {
      setError('Nome do evento é obrigatório')
      return
    }

    try {
      setLoading(true)
      
      const response = isEditMode
        ? await updateEvent(event._id, formData as UpdateEventData)
        : await createEvent(formData as CreateEventData)
      
      if (response.success && response.data) {
        onEventSaved(response.data)
        onClose()
      }
    } catch (err: any) {
      setError(err.response?.data?.message || `Erro ao ${isEditMode ? 'atualizar' : 'criar'} evento`)
      console.error(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} evento:`, err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof CreateEventData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Editar Evento' : 'Criar Novo Evento'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Erro</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Nome do Evento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Evento *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Ex: Black Friday 2024"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Descreva o evento, suas regras e objetivos..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Opcional - Ajuda os participantes a entenderem o evento
            </p>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Início
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Opcional</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Término
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                min={formData.startDate || undefined}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Opcional</p>
            </div>
          </div>

          {/* Status Ativo */}
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="isActive" className="flex-1">
              <span className="text-sm font-medium text-gray-900">
                Evento Ativo
              </span>
              <p className="text-xs text-gray-600 mt-0.5">
                Eventos ativos permitem registro de usuários e pontuação
              </p>
            </label>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              {isEditMode ? 'ℹ️ Informações' : '💡 Próximos passos'}
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {isEditMode ? (
                <>
                  <li>• As alterações serão aplicadas imediatamente</li>
                  <li>• Usuários já registrados não serão afetados</li>
                  <li>• Você pode desativar o evento a qualquer momento</li>
                </>
              ) : (
                <>
                  <li>• Após criar o evento, você poderá adicionar ações</li>
                  <li>• Configure pontos e regras para cada ação</li>
                  <li>• Ative o evento quando estiver pronto</li>
                </>
              )}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{isEditMode ? 'Salvando...' : 'Criando...'}</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{isEditMode ? 'Salvar Alterações' : 'Criar Evento'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
