'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function BottomNav({ activeTab, onLeads, onFollowUps, onAdd }) {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 flex items-center"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >

      {/* Leads tab */}
      <button
        onClick={onLeads}
        className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors relative ${
          activeTab === 'leads'
            ? 'text-gray-900'
            : 'text-gray-400'
        }`}
      >
        <FontAwesomeIcon icon="table-list" className="text-lg" />
        <span className="text-[10px] font-medium">Leads</span>

        {activeTab === 'leads' && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gray-900 rounded-full" />
        )}
      </button>

      {/* Add lead — raised centre button */}
      <div className="flex-1 flex items-center justify-center">
        <button
          onClick={onAdd}
          className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 active:scale-95 transition-all -mt-4"
        >
          <FontAwesomeIcon icon="plus" className="text-white text-base" />
        </button>
      </div>

      {/* Follow-ups tab */}
      <button
        onClick={onFollowUps}
        className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors relative ${
          activeTab === 'followups'
            ? 'text-gray-900'
            : 'text-gray-400'
        }`}
      >
        <FontAwesomeIcon icon={['far', 'clock']} className="text-lg" />
        <span className="text-[10px] font-medium">Follow-ups</span>

        {activeTab === 'followups' && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gray-900 rounded-full" />
        )}
      </button>

    </nav>
  )
}