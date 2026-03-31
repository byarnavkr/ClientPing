'use client'
import '@/lib/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function MobileHeader({ onMenuClick }) {
  return (
    <header className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 z-20">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
          <FontAwesomeIcon icon={['fas', 'bolt']} className="text-white text-xs" />
        </div>
        <span className="font-bold text-lg tracking-tight">ClientPing</span>
      </div>
      <button
        onClick={onMenuClick}
        className="text-gray-500 hover:text-gray-900 transition-colors p-2"
      >
        <FontAwesomeIcon icon="bars" className="text-lg" />
      </button>
    </header>
  )
}