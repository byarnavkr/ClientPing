'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { insertLead } from '@/lib/leadMutations'

const EMPTY = {
  name:          '',
  contact:       '',
  status:        'new lead',
  deal_value:    '',
  interval_days: '1',
  priority:      'medium',
  notes:         '',
  // follow_up_date is NOT in the form — calculated on submit
}

// today + n days → YYYY-MM-DD string for Supabase
function calcFollowUpDate(intervalDays) {
  const d = new Date()
  d.setDate(d.getDate() + Number(intervalDays))
  return d.toISOString().slice(0, 10)
}

export default function AddLeadForm({ onClose }) {
  const [fields, setFields] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState(null)

  function handle(e) {
    setFields(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  async function submit() {
    if (!fields.name.trim()) { setError('Name is required'); return }
    setSaving(true); setError(null)
    try {
      await insertLead({
        name:          fields.name,
        contact:       fields.contact,
        status:        fields.status,
        deal_value:    fields.deal_value    || null,
        interval_days: fields.interval_days || null,
        priority:      fields.priority,
        notes:         fields.notes         || null,
        // follow_up_date = today + interval_days
        follow_up_date: calcFollowUpDate(fields.interval_days),
      })
      onClose()
    } catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">New lead</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors p-1"
          >
            <FontAwesomeIcon icon="xmark" />
          </button>
        </div>

        {/* Body */}
        <div
          className="px-6 py-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto"
          style={{scrollbarWidth: 'thin'}}
        >

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Name</label>
            <input
              type="text" name="name" placeholder="Company or person name"
              value={fields.name} onChange={handle}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Contact</label>
            <input
              type="text" name="contact" placeholder="Phone, email, @handle or URL"
              value={fields.contact} onChange={handle}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
            />
          </div>

          {/* Status + Deal Value */}
          <div className="grid grid-cols-2 gap-3">

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
              <select
                name="status" value={fields.status} onChange={handle}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 bg-white transition-all"
              >
                {[
                  { value: 'new lead',   label: 'New Lead' },
                  { value: 'interested', label: 'Interested' },
                  { value: 'client',     label: 'Client' },
                  { value: 'lost',       label: 'Lost' },
                ].map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}

              </select>
            </div>

            {/* Deal value — green $ prefix, no spinner arrows */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Deal Value</label>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-gray-900/10 focus-within:border-gray-900 transition-all">
                <span className="px-3 py-2 bg-emerald-50 text-emerald-600 text-sm font-semibold border-r border-gray-200 select-none">
                  $
                </span>
                <input
                  type="text"
                  name="deal_value"
                  placeholder="0"
                  value={fields.deal_value}
                  onChange={handle}
                  className="flex-1 px-3 py-2 text-sm outline-none bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

          </div>

          {/* Follow-up interval */}
          <div>
            <div className="block text-xs font-medium text-gray-600 mb-2">
              Follow-up Reminder
            </div>
            <div className="border border-gray-200 rounded-lg px-3 py-2.5 bg-white">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-900">
                  Every{' '}
                  <span className="text-gray-700">
                    {fields.interval_days}
                  </span>
                  {' '}day{fields.interval_days == 1 ? '' : 's'}
                  <span className="text-xs text-gray-400 ml-2 font-normal">
                    — first reminder {calcFollowUpDate(fields.interval_days)}
                  </span>
                </div>
                <div className="flex flex-col leading-none">
                  <button
                    type="button"
                    onClick={() => setFields(p => ({
                      ...p, interval_days: Number(p.interval_days) + 1
                    }))}
                    className="text-gray-400 hover:text-gray-700 text-xs px-1"
                  >▲</button>
                  <button
                    type="button"
                    onClick={() => setFields(p => ({
                      ...p, interval_days: Math.max(1, Number(p.interval_days) - 1)
                    }))}
                    className="text-gray-400 hover:text-gray-700 text-xs px-1 -mt-0.5"
                  >▼</button>
                </div>
              </div>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Priority</label>
            <div className="flex gap-2">
              {[
                { key: 'high',   icon: 'arrow-up',   active: 'border-red-200 bg-red-50 text-red-700',     inactive: 'border-gray-200 bg-white text-gray-500' },
                { key: 'medium', icon: 'minus',      active: 'border-amber-200 bg-amber-50 text-amber-700', inactive: 'border-gray-200 bg-white text-gray-500' },
                { key: 'low',    icon: 'arrow-down', active: 'border-emerald-200 bg-emerald-50 text-emerald-700', inactive: 'border-gray-200 bg-white text-gray-500' },
              ].map(({ key, icon, active, inactive }) => (
                <button
                  key={key} type="button"
                  onClick={() => setFields(p => ({ ...p, priority: key }))}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border-2 transition-all capitalize ${fields.priority === key ? active : inactive}`}
                >
                  <FontAwesomeIcon icon={icon} className="text-[10px] mr-1" />
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Notes</label>
            <textarea
              name="notes" rows={3} value={fields.notes} onChange={handle}
              placeholder="Any notes about this lead..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 resize-none transition-all"
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
          >Cancel</button>
          <button
            onClick={submit} disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <FontAwesomeIcon icon="check" className="text-xs" />
            {saving ? 'Saving...' : 'Save lead'}
          </button>
        </div>

      </div>
    </div>
  )
}