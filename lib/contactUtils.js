/**
 * Detects the type of a contact string and returns
 * { href, type } where type is one of:
 *   'email' | 'phone' | 'url' | 'instagram' | 'text'
 */
export function detectContact(value = '') {
  const v = value.trim()
  if (!v) return { href: null, type: 'text' }

  // Email
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
    return { href: `mailto:${v}`, type: 'email' }
  }

  // Instagram handle — @username
  if (/^@[\w.]+$/.test(v)) {
    return { href: `https://instagram.com/${v.slice(1)}`, type: 'instagram' }
  }

  // URL
  if (/^https?:\/\//i.test(v) || /^www\./i.test(v)) {
    const href = /^https?:\/\//i.test(v) ? v : `https://${v}`
    return { href, type: 'url' }
  }

  // Phone — digits, spaces, +, dashes, parens
  if (/^[+\d][\d\s\-()+]{6,}$/.test(v)) {
    return { href: `tel:${v.replace(/\s/g, '')}`, type: 'phone' }
  }

  return { href: null, type: 'text' }
}