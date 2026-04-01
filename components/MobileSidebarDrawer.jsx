'use client'

import { useEffect } from 'react'
import FollowUpSidebar from '@/components/FollowUpSidebar'

export default function MobileSidebarDrawer({
  open, onClose, leads, onNewLead, onSignOut, onSelectLead, onMarkDone
}) {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-[300px] transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Reuse the exact same sidebar — it handles its own scroll */}
        <div className="h-full [&>aside]:flex [&>aside]:w-full">
          <FollowUpSidebar
            leads={leads}
            onNewLead={() => { onNewLead(); onClose() }}
            onSignOut={onSignOut}
            onSelectLead={(lead) => { onSelectLead(lead); onClose() }}
            onMarkDone={onMarkDone}
            forceMobile
          />
        </div>
      </div>
    </>
  )
}