// Formats: "24 Mar 2026, 4:11 PM"
export function formatDate(timestamp) {
  if (!timestamp) return '—'
  return new Date(timestamp).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

// Relative time: "2 days ago", "in 3 hours"
export function formatRelative(timestamp) {
  if (!timestamp) return '—'
  const diff = Date.now() - new Date(timestamp).getTime()
  const abs = Math.abs(diff)
  if (abs < 60000) return 'just now'
  if (abs < 3600000) return `${Math.floor(abs/60000)}m ago`
  if (abs < 86400000) return `${Math.floor(abs/3600000)}h ago`
  const days = Math.floor(abs/86400000)
  return diff > 0 ? `${days}d ago` : `in ${days}d`
}

// Status → { label, color classes }
export function getStatusStyle(status) {
  const map = {
    new:       { label: 'New Lead',       bg: '#E1F5EE', color: '#3c3c3c' },
    contacted: { label: 'Interested', bg: '#FAEEDA', color: '#066323' },
    qualified: { label: 'Client', bg: '#E6F1FB', color: '#6f0c7c' },
    closed:    { label: 'Lost',    bg: '#EAF3DE', color: '#620a0a' },
  }
  return map[status] ?? { label: status, bg: '#F1EFE8', color: '#2C2C2A' }
}

// Returns Tailwind classes + label for the ClientPing status badge
export function getStatusBadge(status) {
  const map = {
    new:        { label: 'New',           dot: 'bg-gray-500',   badge: 'bg-gray-100 text-gray-700 border-gray-200/50' },
    contacted:  { label: 'Contacted',     dot: 'bg-purple-500', badge: 'bg-purple-50 text-purple-700 border-purple-100/50' },
    qualified:  { label: 'Qualified',     dot: 'bg-blue-500',   badge: 'bg-blue-50 text-blue-700 border-blue-100/50' },
    proposal:   { label: 'Proposal Sent', dot: 'bg-blue-500',   badge: 'bg-blue-50 text-blue-700 border-blue-100/50' },
    closed:     { label: 'Closed Won',    dot: 'bg-emerald-500',badge: 'bg-emerald-50 text-emerald-700 border-emerald-100/50' },
    lost:       { label: 'Lost',           dot: 'bg-red-500',    badge: 'bg-red-50 text-red-700 border-red-100/50' },
  }
  return map[status] ?? { label: status, dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-600 border-gray-200/50' }
}