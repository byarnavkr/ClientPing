'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function MainHeader({ onNewLead, onSearch, searchValue }) {
  return (
    <header className="hidden md:flex items-center justify-between px-8 py-6 bg-[#F9FAFB] z-10">

      {/* Logo + title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center shadow-sm">
          <FontAwesomeIcon icon="bolt" className="text-white text-sm" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">
            ClientPing
          </h1>
          <p className="text-[13px] text-gray-500 mt-1 font-medium">
            Pipeline & Follow-ups
          </p>
        </div>
      </div>

      {/* Search + New Lead */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <FontAwesomeIcon
            icon="magnifying-glass"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
          />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchValue}
            onChange={e => onSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 w-64 transition-all shadow-sm placeholder:text-gray-400"
          />
        </div>
        <button
          onClick={onNewLead}
          className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow flex items-center gap-2 active:scale-95"
        >
          <FontAwesomeIcon icon="plus" className="text-xs" />
          New Lead
        </button>
      </div>

    </header>
  )
}