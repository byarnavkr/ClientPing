'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { groupLeadsByFollowUp } from '@/lib/followUpUtils'
import FollowUpCard from '@/components/FollowUpCard'
import SidebarProfile from '@/components/SidebarProfile'

export default function FollowUpSidebar({
  leads,
  onNewLead,
  onSignOut,
  onSelectLead,
  onMarkDone,   // new
}) {


  
  const { overdue, today, upcoming } = groupLeadsByFollowUp(leads)

  return (
    <aside className="hidden md:flex w-[320px] flex-col bg-white border-r border-gray-200 h-full z-10 flex-shrink-0">

      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2.5 text-sm tracking-wide">
          <FontAwesomeIcon icon={['far', 'clock']} className="text-gray-400" />
          Follow-ups
        </h2>
        <button
          onClick={onNewLead}
          className="text-gray-400 hover:text-gray-900 transition-colors"
        >
          <FontAwesomeIcon icon="plus" className="text-sm" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8" style={{scrollbarWidth:'thin'}}>

        {overdue.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-red-600">Overdue</h3>
              <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100">
                {overdue.length}
              </span>
            </div>
            <div className="space-y-2">
              {overdue.map(lead => (
                <FollowUpCard
                  key={lead.id}
                  lead={lead}
                  variant="overdue"
                  onClick={() => onSelectLead?.(lead)}
                  onMarkDone={onMarkDone ? () => onMarkDone(lead) : undefined}
                />
              ))}
            </div>
          </section>
        )}

        {today.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-amber-600">Today</h3>
              <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-100">
                {today.length}
              </span>
            </div>
            <div className="space-y-2">
              {today.map(lead => (
                <FollowUpCard
                  key={lead.id}
                  lead={lead}
                  variant="today"
                  onClick={() => onSelectLead?.(lead)}
                  onMarkDone={onMarkDone ? () => onMarkDone(lead) : undefined}
                />
              ))}
            </div>
          </section>
        )}

        {upcoming.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Upcoming</h3>
            </div>
            <div className="space-y-2">
              {upcoming.map(lead => (
                <FollowUpCard
                  key={lead.id}
                  lead={lead}
                  variant="upcoming"
                  onClick={() => onSelectLead?.(lead)}
                  onMarkDone={onMarkDone ? () => onMarkDone(lead) : undefined}
                />
              ))}
            </div>
          </section>
        )}

        {overdue.length === 0 && today.length === 0 && upcoming.length === 0 && (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={['far', 'clock']} className="text-gray-200 text-3xl mb-3" />
            <p className="text-sm text-gray-400">No follow-ups scheduled</p>
          </div>
        )}

      </div>

      <SidebarProfile onSignOut={onSignOut} />

    </aside>
  )
}