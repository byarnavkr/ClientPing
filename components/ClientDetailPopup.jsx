'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { updateLead } from '@/lib/leadMutations'
import { getStatusBadge } from '@/lib/formatters'
import { getFollowUpGroup, getFollowUpLabel } from '@/lib/followUpUtils'
import AvatarInitials from '@/components/AvatarInitials'
import ContactLink from '@/components/ContactLink'

const STATUSES = [
  { value: 'new lead',       label: 'New lead' },
  { value: 'interested ', label: 'interested ' },
  { value: 'client', label: 'client' },
  { value: 'lost',  label: 'lost' },
]

function formatCurrency(val) {
  if (!val && val !== 0) return ''
  return Number(val).toLocaleString('en-US')
}

function formatCreated(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function ClientDetailPopup({ lead, onClose, onSaved }) {
  const [fields, setFields]   = useState({})
  const [saving, setSaving]   = useState(false)
  const [visible, setVisible] = useState(false)

  // Populate fields + animate in whenever the lead changes
  useEffect(() => {
    if (!lead) return
    setFields({
      name: lead.name ?? '',
      contact: lead.contact ?? '',
      status:     lead.status     ?? 'new',
      deal_value: lead.deal_value != null
        ? formatCurrency(lead.deal_value)
        : '',
      // date-only: slice to 10 chars (YYYY-MM-DD)
      follow_up_date: lead.follow_up_date
        ? new Date(lead.follow_up_date).toISOString().slice(0, 10)
        : '',
      priority: lead.priority ?? 'medium',
      notes:    lead.notes    ?? '',
      interval_days: lead.interval_days ?? '',
    })
    requestAnimationFrame(() => setVisible(true))
  }, [lead])

  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 200)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const saved = await updateLead(lead.id, {
        status:         fields.status,
        deal_value:     fields.deal_value.replace(/,/g, '') || null,
        follow_up_date: fields.follow_up_date || null,
        priority:       fields.priority,
        notes:          fields.notes,
        interval_days: fields.interval_days !== '' 
        ? Number(fields.interval_days): null,
      })
      onSaved?.(saved)
      handleClose()
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  if (!lead) return null

  const fGroup = getFollowUpGroup(lead.follow_up_date)
  const fLabel = getFollowUpLabel(lead.follow_up_date)
  const followUpColor =
    fGroup === 'overdue' ? 'text-red-600'
    : fGroup === 'today'  ? 'text-amber-600'
    : 'text-gray-600'

  return (

    <div
      className={`fixed inset-0 z-50 flex md:items-center md:justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={e => e.target === e.currentTarget && handleClose()}
    >
      <div
        className={`bg-white w-full h-full md:h-auto md:max-w-2xl lg:max-w-3xl md:rounded-xl p-6 max-h-[90vh] overflow-y-auto flex flex-col transform transition-all duration-200 ${
          visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >

        {/* ── Header ── */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-start justify-between bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex-shrink-0">
              <AvatarInitials name={lead.name} size="lg" />
            </div>
            <div>
              {/*making name and contact fields editable */}

              <input
                type="text"
                value={fields.name}
                onChange={e => setFields(p => ({ ...p, name: e.target.value }))}
                className="text-xl font-bold text-gray-900 tracking-tight bg-transparent border-none outline-none focus:ring-0"
              />

              <input
                type="text"
                value={fields.contact}
                onChange={e => setFields(p => ({ ...p, contact: e.target.value }))}
                className="text-sm text-gray-500 mt-0.5 font-medium bg-transparent border-none outline-none focus:ring-0"
              />

            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg -mr-2 -mt-1"
          >
            <FontAwesomeIcon icon="xmark" className="text-lg" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto p-8" style={{scrollbarWidth:'thin'}}>

          {/* ── Info grid — 4 read-only cards ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">

            {/* Contact card */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold mb-2">
                Contact
              </div>
              {/*fixing info grid for editable name and contact fields */}

              <input
                type="text"
                value={fields.name}
                onChange={e => setFields(p => ({ ...p, name: e.target.value }))}
                className="text-sm font-semibold text-gray-900 bg-transparent border-none outline-none w-full"
              />

              <input
                type="text"
                value={fields.contact}
                onChange={e => setFields(p => ({ ...p, contact: e.target.value }))}
                className="text-xs text-gray-500 mt-0.5 block truncate bg-transparent border-none outline-none w-full"
              />

            </div>

            {/* Deal Value card — editable inline */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold mb-2">
                Deal Value
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon="dollar-sign" className="text-emerald-500 text-xs" />
                <input
                  type="text"
                  value={fields.deal_value}
                  onChange={e => setFields(p => ({ ...p, deal_value: e.target.value }))}
                  placeholder="0"
                  className="text-lg font-bold text-gray-900 bg-transparent border-none outline-none w-full p-0 focus:ring-0"
                />
              </div>
            </div>

            {/* Follow-up card — read-only display + editable date input */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold mb-2">
                Follow-up
              </div>
              <div className={`text-sm font-semibold flex items-center gap-1.5 mb-2 ${followUpColor}`}>
                {fGroup === 'overdue' && (
                  <FontAwesomeIcon icon="circle-exclamation" className="text-[10px]" />
                )}
                {fGroup !== 'overdue' && (
                  <FontAwesomeIcon icon={['far', 'calendar']} className="text-[11px]" />
                )}
                {fLabel || 'Not set'}
              </div>
              {/* Date-only picker */}
              <input
                type="date"
                value={fields.follow_up_date}
                onChange={e => setFields(p => ({ ...p, follow_up_date: e.target.value }))}
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-900/10 bg-white"
              />
            </div>

            {/* Interval days card */}
            
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              
              {/* Heading */}
              <div className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold mb-2">
                Follow Up Reminder
              </div>

              {/* Row */}
              <div className="flex items-center justify-between">
                
                {/* Sentence */}
                <div className="text-gray-900 font-semibold text-base">
                  Every {fields.interval_days} days
                </div>

                {/* Minimal stepper (no box) */}
                <div className="flex flex-col leading-none">
                  <button
                    onClick={() =>
                      setFields(p => ({ ...p, interval_days: p.interval_days + 1 }))
                    }
                    className="text-gray-400 hover:text-gray-600 text-xs"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() =>
                      setFields(p => ({
                        ...p,
                        interval_days: Math.max(1, p.interval_days - 1),
                      }))
                    }
                    className="text-gray-400 hover:text-gray-600 text-xs -mt-1"
                  >
                    ▼
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* ── Status + Priority — 2-column grid (project_type removed) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

            {/* Status dropdown */}
            <div>
              <label className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold mb-2 block">
                Status
              </label>
              <div className="relative">
                <select
                  value={fields.status}
                  onChange={e => setFields(p => ({ ...p, status: e.target.value }))}
                  className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 cursor-pointer shadow-sm pr-10 transition-all"
                >
                  {STATUSES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <FontAwesomeIcon
                  icon="chevron-down"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"
                />
              </div>
            </div>


          </div>

          {/* ── Notes ── */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">
                Notes
              </label>
              <span className="text-[11px] text-gray-400">Saved on Save Changes</span>
            </div>
            <textarea
              rows={6}
              value={fields.notes}
              onChange={e => setFields(p => ({ ...p, notes: e.target.value }))}
              placeholder="Add notes about this client..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 resize-none transition-all placeholder:text-gray-400 leading-relaxed"
              style={{scrollbarWidth: 'thin'}}
            />
          </div>

          {/* ── Activity timeline ── */}
          <div>
            <label className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold mb-3 block">
              Recent Activity
            </label>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FontAwesomeIcon icon="plus" className="text-[10px]" />
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">Lead created</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {lead.created_at
                      ? new Date(lead.created_at).toLocaleString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                          hour: 'numeric', minute: '2-digit',
                        })
                      : '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between flex-shrink-0">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all shadow-sm hover:shadow flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <FontAwesomeIcon icon="check" className="text-xs" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  )
}