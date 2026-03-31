import { detectContact } from '@/lib/contactUtils'

const ICONS = {
  email:     '✉',
  phone:     '📞',
  url:       '🔗',
  instagram: '📸',
}

export default function ContactLink({ contact, className = '', showIcon = false }) {
  if (!contact) return <span className={className}>—</span>

  const { href, type } = detectContact(contact)

  if (!href) {
    return <span className={className}>{contact}</span>
  }

  const isExternal = type === 'url' || type === 'instagram'

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={`hover:underline underline-offset-2 transition-colors ${className}`}
      onClick={e => e.stopPropagation()}
    >
      {showIcon && <span className="mr-1 text-[11px]">{ICONS[type]}</span>}
      {contact}
    </a>
  )
}