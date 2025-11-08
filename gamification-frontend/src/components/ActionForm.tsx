import { useState } from 'react'
import { Target, X, Save, AlertCircle, Repeat } from 'lucide-react'
import { createAction, updateAction } from '../services/api'
import type { CreateActionData, UpdateActionData, Action } from '../types'

interface ActionFormProps {
  eventId: string
  eventName: string
  action?: Action // Se fornecido, é modo edição; caso contrário, é criação
  onClose: () => void
  onActionSaved: () => void
}

export default function ActionForm({ eventId, eventName, action, onClose, onActionSaved }: ActionFormProps) {
  const isEditMode = !!action
  
  const [formData, setFormData] = useState<CreateActionData | UpdateActionData>({
    name: action?.name || '',
    description: action?.description || '',
    points: action?.points || 0,
    allowMultiple: action?.allowMultiple ?? true,
    isActive: action?.isActive ?? true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name?.trim()) {
      setError('Nome da ação é obrigatório')
      return
    }

    if ((formData.points || 0) <= 0) {
      setError('Pontos devem ser maior que zero')
      return
    }

    try {
      setLoading(true)
      
      const response = isEditMode
        ? await updateAction(action._id, formData as UpdateActionData)
        : await createAction(eventId, formData as CreateActionData)
      
      if (response.success) {
        onActionSaved()
        onClose()
      }
    } catch (err: any) {
      setError(err.response?.data?.message || `Erro ao ${isEditMode ? 'atualizar' : 'criar'} ação`)
      console.error(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} ação:`, err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof CreateActionData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <Target className="h-6 w-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Editar Ação' : 'Criar Nova Ação'}
              </h2>
            </div>
            <p className="text-sm text-gray-600">Evento: {eventName}</p>
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

          {/* Nome da Ação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Ação *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Ex: Realizar compra"
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
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Descreva como o usuário pode realizar esta ação..."
            />
          </div>

          {/* Pontos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pontos *
            </label>
            <input
              type="number"
              value={formData.points}
              onChange={(e) => handleChange('points', parseInt(e.target.value) || 0)}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="100"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Quantos pontos o usuário ganha ao realizar esta ação
            </p>
          </div>

          {/* Permitir Múltiplas */}
          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="allowMultiple"
              checked={formData.allowMultiple}
              onChange={(e) => handleChange('allowMultiple', e.target.checked)}
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-0.5"
            />
            <label htmlFor="allowMultiple" className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Repeat className="h-4 w-4 text-indigo-600" />
                <span className="text-sm font-medium text-gray-900">
                  Permitir múltiplas execuções
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Se marcado, o usuário pode realizar esta ação várias vezes e ganhar pontos em cada execução
              </p>
            </label>
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
                Ação Ativa
              </span>
              <p className="text-xs text-gray-600 mt-0.5">
                Apenas ações ativas podem ser realizadas pelos usuários
              </p>
            </label>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              {isEditMode ? 'ℹ️ Informações' : '💡 Exemplo de configuração'}
            </h4>
            {isEditMode ? (
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• As alterações serão aplicadas imediatamente</li>
                <li>• Pontuações anteriores não serão afetadas</li>
                <li>• Você pode desativar a ação a qualquer momento</li>
              </ul>
            ) : (
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Ação única:</strong> "Cadastrar na newsletter" - 25 pontos (não permite múltiplas)</p>
                <p><strong>Ação repetível:</strong> "Realizar compra" - 100 pontos (permite múltiplas)</p>
              </div>
            )}
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
                  <span>{isEditMode ? 'Salvar Alterações' : 'Criar Ação'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
