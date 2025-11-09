import { useState, FormEvent } from 'react'
import { UserPlus } from 'lucide-react'
import { RegisterUserData } from '../types'

interface RegistrationFormProps {
  onRegister: (data: RegisterUserData) => void
  eventName: string
}

export default function RegistrationForm({ onRegister, eventName }: RegistrationFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (name && email) {
      onRegister({ name, email })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <UserPlus className="h-6 w-6 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Register for {eventName}
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Your full name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="your@email.com"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Register
        </button>
      </form>
    </div>
  )
}
