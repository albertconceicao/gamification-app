import { useState } from 'react'
import { Target, X, Save, AlertCircle } from 'lucide-react'
import { createAction, updateAction } from '../services/api'
import type { CreateActionData, UpdateActionData, Action } from '../types'

interface ActionFormProps {
  eventId: string
  eventName: string
  handle?: string
  action?: Action // Se fornecido, é modo edição; caso contrário, é criação
  onClose: () => void
  onActionSaved: () => void
}

export default function ActionForm({ eventId, eventName, handle, action, onClose, onActionSaved }: ActionFormProps) {
  const isEditMode = !!action
  
  const [formData, setFormData] = useState<CreateActionData | UpdateActionData>({
    name: action?.name || '',
    handle: isEditMode ? action?.handle || '' : handle,
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
      setError('Action name is required')
      return
    }

    if ((formData.points || 0) <= 0) {
      setError('Points must be greater than zero')
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
      setError(err.response?.data?.message || `Error ${isEditMode ? 'updating' : 'creating'} action`)
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} action:`, err)
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
                {isEditMode ? 'Edit Action' : 'New Action'}
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              Event: <span className="font-medium">{eventName}</span>
            </p>
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
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Nome da Ação */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Action Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., Complete challenge"
              required
            />
          </div>

          {/* Handle */}
          <div>
            <label htmlFor="handle" className="block text-sm font-medium text-gray-700 mb-1">
              Handle <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="handle"
              value={formData.handle}
              onChange={(e) => handleChange('handle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., complete-challenge"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Describe the action..."
            />
          </div>

          {/* Pontos */}
          <div>
            <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">
              Points <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="points"
                min="1"
                step="1"
                value={formData.points}
                onChange={(e) => handleChange('points', parseInt(e.target.value) || 0)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., 100"
                required
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                <Target className="h-4 w-4" />
              </span>
            </div>
          </div>

          {/* Permitir Múltiplas */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="allowMultiple"
              checked={formData.allowMultiple}
              onChange={(e) => handleChange('allowMultiple', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="allowMultiple" className="ml-2 block text-sm text-gray-700">
              Allow multiple executions
            </label>
          </div>

          {/* Status Ativo */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Action active
            </label>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              {isEditMode ? 'ℹ️ Information' : '💡 Example configuration'}
            </h4>
            {isEditMode ? (
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Changes will be applied immediately</li>
                <li>• Previous scores will not be affected</li>
                <li>• You can deactivate the action at any time</li>
              </ul>
            ) : (
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Single action:</strong> "Subscribe to newsletter" - 25 points (does not allow multiple)</p>
                <p><strong>Repeatable action:</strong> "Make a purchase" - 100 points (allows multiple)</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditMode ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? 'Save Changes' : 'Create Action'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
