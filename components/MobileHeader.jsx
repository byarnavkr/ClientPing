'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function MobileHeader({ onMenuClick }) {
  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
      
      {/* Left: Logo + Name */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
          <FontAwesomeIcon icon="bolt" className="text-white text-xs" />
        </div>
        <span className="font-bold text-base tracking-tight text-gray-900">
          ClientPing
        </span>
      </div>

      {/* Right: Menu button */}
      <button
        onClick={onMenuClick}
        className="text-gray-500 hover:text-gray-900 transition-colors p-2 -mr-2"
      >
        <FontAwesomeIcon icon="bars" className="text-lg" />
      </button>

    </header>
  )
}