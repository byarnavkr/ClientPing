'use client'

const TABS = [
  { key: 'all',    label: 'All Leads' },
]

export default function LeadsTabBar({ active, onChange }) {
  return (
    <div className="flex items-center gap-6 mb-4 px-1 border-b border-gray-200">
      {TABS.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`pb-3 text-sm font-medium transition-colors relative top-[1px] border-b-2 ${
            active === tab.key
              ? 'text-gray-900 border-gray-900'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}