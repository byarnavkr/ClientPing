'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { createClient } from '@/lib/supabase/client'

export default function SidebarProfile({ onSignOut }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const email = user?.email ?? ''
  const initials = email.slice(0, 2).toUpperCase()

  return (
    <div className="p-4 border-t border-gray-100 bg-gray-50/50">
      <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
        <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold border border-gray-200 flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{email}</p>
          <p className="text-xs text-gray-500 truncate">Logged in</p>
        </div>
        <button
          onClick={onSignOut}
          title="Sign out"
          className="text-gray-400 hover:text-gray-700 transition-colors"
        >
          <FontAwesomeIcon icon="sign-out-alt" className="text-sm" />
        </button>
      </div>
    </div>
  )
}