'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { deleteLead } from '@/lib/leadMutations'
import { getStatusBadge } from '@/lib/formatters'
import { getFollowUpGroup, getFollowUpLabel } from '@/lib/followUpUtils'
import AvatarInitials from '@/components/AvatarInitials'
import ContactLink from '@/components/ContactLink'

function formatDealValue(val) {
  if (!val && val !== 0) return '—'
  return '$' + Number(val).toLocaleString('en-US')
}

// ─── Mobile card ──────────────────────────────────────────────
function LeadCard({ lead, onSelectLead, onDelete }) {
  const badge  = getStatusBadge(lead.status)
  const fGroup = getFollowUpGroup(lead.follow_up_date)
  const fLabel = getFollowUpLabel(lead.follow_up_date)

  const followUpColor =
    fGroup === 'overdue' ? 'text-red-600'
    : fGroup === 'today'  ? 'text-amber-600'
    : 'text-gray-500'

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-4 active:bg-gray-50 transition-colors"
      onClick={() => onSelectLead?.(lead)}
    >
      {/* Top row — avatar + name + status */}
      <div className="flex items-start gap-3 mb-3">
        <AvatarInitials name={lead.name} />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 text-sm truncate">{lead.name}</div>
          <ContactLink
            contact={lead.contact}
            className="text-xs text-gray-500 mt-0.5 block truncate"
            showIcon
          />
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border flex-shrink-0 ${badge.badge}`}>
          <span className={`w-1 h-1 rounded-full mr-1 ${badge.dot}`}></span>
          {badge.label}
        </span>
      </div>

      {/* Bottom row — deal value + follow-up + delete */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs">
          {lead.deal_value && (
            <span className="text-emerald-600 font-semibold">
              {formatDealValue(lead.deal_value)}
            </span>
          )}
          {fLabel && (
            <span className={`flex items-center gap-1 font-medium ${followUpColor}`}>
              {fGroup === 'overdue'
                ? <FontAwesomeIcon icon="circle-exclamation" className="text-[9px]" />
                : <FontAwesomeIcon icon={['far','calendar']} className="text-[9px]" />
              }
              {fLabel}
            </span>
          )}
        </div>
        <button
          onClick={e => { e.stopPropagation(); onDelete(lead.id, lead.name) }}
          className="text-gray-400 hover:text-red-500 transition-colors p-1 -mr-1"
        >
          <FontAwesomeIcon icon="trash" className="text-xs" />
        </button>
      </div>
    </div>
  )
}

// ─── Desktop table row ────────────────────────────────────────
function TableRow({ lead, onSelectLead, onDelete }) {
  const badge  = getStatusBadge(lead.status)
  const fGroup = getFollowUpGroup(lead.follow_up_date)
  const fLabel = getFollowUpLabel(lead.follow_up_date)
  const followUpClass =
    fGroup === 'overdue' ? 'text-red-600 bg-red-50 px-2 py-1 rounded inline-flex items-center gap-1.5 font-medium text-[13px]'
    : fGroup === 'today'   ? 'text-amber-600 font-medium text-[13px] flex items-center gap-1.5'
    : 'text-gray-500 text-[13px] flex items-center gap-1.5'

  return (
    <tr className="hover:bg-gray-50/80 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <AvatarInitials name={lead.name} />
          <div className="cursor-pointer hover:text-gray-600 transition-colors" onClick={() => onSelectLead?.(lead)}>
            <div className="font-semibold text-gray-900">{lead.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <ContactLink contact={lead.contact} className="text-gray-700 font-medium" showIcon />
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border ${badge.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${badge.dot}`}></span>
          {badge.label}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className={followUpClass}>
          {fGroup === 'overdue' && <FontAwesomeIcon icon="circle-exclamation" className="text-[10px]" />}
          {(fGroup === 'today' || fGroup === 'upcoming') && <FontAwesomeIcon icon={['far','calendar']} className="text-[11px]" />}
          {fLabel || '—'}
        </div>
      </td>
      <td className="px-6 py-4 font-medium text-gray-900">{formatDealValue(lead.deal_value)}</td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onSelectLead?.(lead)} className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm">Details</button>
          <button onClick={() => onDelete(lead.id, lead.name)} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-100 rounded-lg hover:bg-red-50 hover:border-red-200 transition-all shadow-sm">Delete</button>
        </div>
      </td>
    </tr>
  )
}

// ─── Main export ──────────────────────────────────────────────
export default function LeadsTable({ leads, loading, error, onSelectLead }) {

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try { await deleteLead(id) }
    catch (e) { alert(e.message) }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24 text-gray-400">
      <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mr-3" />
      Loading leads...
    </div>
  )

  if (error) return (
    <div className="p-5 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>
  )

  if (leads.length === 0) return (
    <div className="bg-white border border-gray-200 rounded-xl py-24 text-center text-gray-400 text-sm">
      No leads yet. Add your first one.
    </div>
  )

  return (
    <>
      {/* ── Mobile: card list ── */}
      <div className="md:hidden flex flex-col gap-3 pb-24">
        {leads.map(lead => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onSelectLead={onSelectLead}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* ── Desktop: table ── */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                {['Name','Contact','Status','Follow-up','Deal Value','Actions'].map(h => (
                  <th key={h} className={`px-6 py-3.5 ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {leads.map(lead => (
                <TableRow
                  key={lead.id}
                  lead={lead}
                  onSelectLead={onSelectLead}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}