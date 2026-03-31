'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getFollowUpLabel } from '@/lib/followUpUtils'

// Shared checklist button — same for all variants
function ChecklistBtn({ onMarkDone, hasInterval }) {
  const [doing, setDoing] = useState(false)

  async function handle(e) {
    e.stopPropagation()
    if (doing) return
    setDoing(true)
    try { await onMarkDone() }
    catch (err) { alert(err.message) }
    finally { setDoing(false) }
  }

  return (
    <button
      onClick={handle}
      title={hasInterval
        ? 'Mark done — schedules next follow-up'
        : 'Mark done — clears follow-up date'}
      className={`
        flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
        transition-all duration-150
        ${doing
          ? 'border-emerald-400 bg-emerald-50'
          : 'border-gray-300 bg-white hover:border-emerald-400 hover:bg-emerald-50'
        }
      `}
    >
      {doing && (
        <FontAwesomeIcon icon="check" className="text-emerald-500 text-[8px]" />
      )}
    </button>
  )
}

export default function FollowUpCard({ lead, variant, onClick, onMarkDone }) {
  const label = getFollowUpLabel(lead.follow_up_date)
  const hasInterval = lead.interval_days > 0

  if (variant === 'overdue') return (
    <div
      onClick={onClick}
      className="group p-3.5 rounded-xl border border-red-100 bg-red-50/30 hover:bg-red-50/80 hover:border-red-200 cursor-pointer transition-all duration-200 relative overflow-hidden"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-xl"></div>
      <div className="flex justify-between items-start mb-1.5 pl-1">
        <span className="font-semibold text-gray-900 text-sm group-hover:text-red-900 transition-colors flex-1 mr-2">
          {lead.name}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-red-500 bg-white px-1.5 py-0.5 rounded shadow-sm border border-red-50">
            {label}
          </span>
          {onMarkDone && <ChecklistBtn onMarkDone={onMarkDone} hasInterval={hasInterval} />}
        </div>
      </div>
      <div className="text-xs text-gray-500 flex items-center gap-1.5 pl-1">
        <FontAwesomeIcon icon="tag" className="text-gray-300 text-[10px]" />
        {lead.deal_value != null && (
          <span className="font-medium text-gray-600">
            ${Number(lead.deal_value).toLocaleString('en-US')}
          </span>
        )}
        {lead.deal_value != null && <span className="mx-1 text-gray-300">•</span>}
        <span className="truncate">{lead.contact}</span>
        {hasInterval && (
          <span className="ml-auto text-[10px] text-gray-400 flex-shrink-0">
            every {lead.interval_days}d
          </span>
        )}
      </div>
    </div>
  )

  if (variant === 'today') return (
    <div
      onClick={onClick}
      className="group p-3.5 rounded-xl border border-gray-100 bg-white hover:border-amber-200 hover:shadow-sm cursor-pointer transition-all duration-200 relative overflow-hidden"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex justify-between items-start mb-1.5 pl-1">
        <span className="font-semibold text-gray-900 text-sm flex-1 mr-2">{lead.name}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
            {label}
          </span>
          {onMarkDone && <ChecklistBtn onMarkDone={onMarkDone} hasInterval={hasInterval} />}
        </div>
      </div>
      <div className="text-xs text-gray-500 flex items-center gap-1.5 pl-1">
        <FontAwesomeIcon icon="tag" className="text-gray-300 text-[10px]" />
        {lead.deal_value != null && (
          <span className="font-medium text-gray-600">
            ${Number(lead.deal_value).toLocaleString('en-US')}
          </span>
        )}
        {lead.deal_value != null && <span className="mx-1 text-gray-300">•</span>}
        <span className="truncate">{lead.contact}</span>
        {hasInterval && (
          <span className="ml-auto text-[10px] text-gray-400 flex-shrink-0">
            every {lead.interval_days}d
          </span>
        )}
      </div>
    </div>
  )

  // upcoming
  return (
    <div
      onClick={onClick}
      className="group p-3.5 rounded-xl border border-transparent hover:bg-gray-50 hover:border-gray-200 cursor-pointer transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-1.5">
        <span className="font-medium text-gray-700 text-sm group-hover:text-gray-900 flex-1 mr-2">
          {lead.name}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-gray-400">{label}</span>
          {onMarkDone && <ChecklistBtn onMarkDone={onMarkDone} hasInterval={hasInterval} />}
        </div>
      </div>
      <div className="text-xs text-gray-400 flex items-center gap-1.5">
        <FontAwesomeIcon icon="tag" className="text-gray-300 text-[10px]" />
        {lead.deal_value != null
          ? <span>${Number(lead.deal_value).toLocaleString('en-US')}</span>
          : <span>{lead.contact}</span>
        }
        {hasInterval && (
          <span className="ml-auto text-[10px] text-gray-400 flex-shrink-0">
            every {lead.interval_days}d
          </span>
        )}
      </div>
    </div>
  )
}