const COLORS = [
  'bg-indigo-50 text-indigo-600 border-indigo-100',
  'bg-emerald-50 text-emerald-600 border-emerald-100',
  'bg-sky-50 text-sky-600 border-sky-100',
  'bg-amber-50 text-amber-600 border-amber-100',
  'bg-rose-50 text-rose-600 border-rose-100',
  'bg-violet-50 text-violet-600 border-violet-100',
  'bg-teal-50 text-teal-600 border-teal-100',
  'bg-orange-50 text-orange-600 border-orange-100',
]

function getColor(name = '') {
  let hash = 0
  for (const ch of name) hash = ch.charCodeAt(0) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function AvatarInitials({ name, size = 'sm' }) {
  const sizeClass = size === 'lg'
    ? 'w-14 h-14 rounded-xl text-lg font-bold border shadow-sm'
    : 'w-8 h-8 rounded-full text-xs font-bold border flex-shrink-0'

  return (
    <div className={`flex items-center justify-center ${sizeClass} ${getColor(name)}`}>
      {getInitials(name)}
    </div>
  )
}