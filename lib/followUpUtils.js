// Returns 'overdue' | 'today' | 'upcoming' | null
export function getFollowUpGroup(timestamp) {
  if (!timestamp) return null
  const now       = new Date()
  const date      = new Date(timestamp)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayEnd   = new Date(todayStart.getTime() + 86400000)

  if (date < todayStart) return 'overdue'
  if (date < todayEnd)   return 'today'
  return 'upcoming'
}

// Returns the badge label shown in sidebar cards and table cells
export function getFollowUpLabel(timestamp) {
  if (!timestamp) return '—'
  const now          = new Date()
  const date         = new Date(timestamp)
  const todayStart    = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterdayStart = new Date(todayStart.getTime() - 86400000)
  const tomorrowStart  = new Date(todayStart.getTime() + 86400000)
  const diffDays = Math.floor((todayStart - date) / 86400000)

  if (date < yesterdayStart) return `${diffDays} days ago`
  if (date < todayStart)     return 'Yesterday'
  if (date < tomorrowStart)  return 'Today'       // ← no time anymore
  if (date < new Date(tomorrowStart.getTime() + 86400000)) return 'Tomorrow'
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

// Groups an array of leads into { overdue, today, upcoming }
export function groupLeadsByFollowUp(leads) {
  const groups = { overdue: [], today: [], upcoming: [] }
  for (const lead of leads) {
    const group = getFollowUpGroup(lead.follow_up_date)
    if (group) groups[group].push(lead)
  }
  return groups
}