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
      setError('Event name is required')
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
      setError(err.response?.data?.message || `Error ${isEditMode ? 'updating' : 'creating'} event`)
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} event:`, err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof CreateEventData, value: string | boolean | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Event' : 'New Event'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md flex items-start">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Event Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Event Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., Hackathon 2023"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Describe the event..."
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="startDate"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                <Calendar className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date (Optional)
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="endDate"
                  value={formData.endDate || ''}
                  onChange={(e) => handleChange('endDate', e.target.value || undefined)}
                  min={formData.startDate}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Calendar className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* Status Active */}
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Active event
            </label>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              {isEditMode ? 'ℹ️ Information' : '💡 Next Steps'}
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {isEditMode ? (
                <>
                  <li>• Changes will be applied immediately</li>
                  <li>• Users already registered will not be affected</li>
                  <li>• You can deactivate the event at any time</li>
                </>
              ) : (
                <>
                  <li>• After creating the event, you can add actions</li>
                  <li>• Configure points and rules for each action</li>
                  <li>• Activate the event when you're ready</li>
                </>
              )}
            </ul>
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
                  {isEditMode ? 'Save Changes' : 'Create Event'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
