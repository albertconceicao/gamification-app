import { useState } from 'react'
import { X, Copy, Check, Code, ExternalLink } from 'lucide-react'
import type { Event } from '../types'

interface EmbedCodeModalProps {
  event: Event
  onClose: () => void
}

export default function EmbedCodeModal({ event, onClose }: EmbedCodeModalProps) {
  const [copied, setCopied] = useState(false)
  const [config, setConfig] = useState({
    limit: 10,
    theme: 'light',
    showEmail: true,
    refresh: 0,
    title: ''
  })

  const baseUrl = window.location.origin
  const embedUrl = `${baseUrl}/embed/ranking/${event._id}`
  
  const buildUrl = () => {
    const params = new URLSearchParams()
    
    if (config.limit !== 10) params.append('limit', config.limit.toString())
    if (config.theme !== 'light') params.append('theme', config.theme)
    if (!config.showEmail) params.append('showEmail', 'false')
    if (config.refresh > 0) params.append('refresh', config.refresh.toString())
    if (config.title) params.append('title', config.title)
    
    const queryString = params.toString()
    return queryString ? `${embedUrl}?${queryString}` : embedUrl
  }

  const finalUrl = buildUrl()

  const iframeCode = `<iframe 
  src="${finalUrl}"
  width="100%"
  height="600"
  frameborder="0"
  scrolling="auto"
  style="border: none; border-radius: 8px;"
></iframe>`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Code className="h-6 w-6 text-indigo-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Embed Code</h2>
              <p className="text-sm text-gray-600 mt-1">{event.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Configuration */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Limit */}
              <div>
                <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-1">
                  Participant limit
                </label>
                <input
                  type="number"
                  id="limit"
                  min="1"
                  max="100"
                  value={config.limit}
                  onChange={(e) => setConfig({ ...config, limit: parseInt(e.target.value) || 10 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <select
                  value={config.theme}
                  onChange={(e) => setConfig({ ...config, theme: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              {/* Auto Refresh */}
              <div>
                <label htmlFor="refresh" className="block text-sm font-medium text-gray-700 mb-1">
                  Auto-refresh (seconds)
                </label>
                <input
                  type="number"
                  id="refresh"
                  min="0"
                  max="3600"
                  value={config.refresh}
                  onChange={(e) => setConfig({ ...config, refresh: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0 to disable"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom title (optional)
                </label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Ranking"
                />
              </div>
            </div>

            {/* Show Email Toggle */}
            <div className="mt-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showEmail}
                  onChange={(e) => setConfig({ ...config, showEmail: e.target.checked })}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Show participant emails
                </span>
              </label>
            </div>
          </div>

          {/* URL Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">Embed the Ranking</h2>
              <a
                href={finalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open in new tab</span>
              </a>
            </div>
            <div className="relative">
              <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm overflow-x-auto">
                <p className="text-gray-600">Add the event ranking to your website</p>
                <code className="text-gray-800">{finalUrl}</code>
              </pre>
              <button
                onClick={() => copyToClipboard(finalUrl)}
                className="absolute top-2 right-2 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                title="Copy URL"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Iframe Code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-gray-900">HTML Code (Iframe)</h2>
              <button
                onClick={() => copyToClipboard(iframeCode)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto">
              <code>{iframeCode}</code>
            </pre>
          </div>

          {/* Info */}
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">How to use</h3>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
              <li>Copy the HTML code above</li>
              <li>Paste it into your website code where you want the ranking to appear</li>
              <li>Adjust the settings as needed</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
