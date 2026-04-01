'use client'

import { useState, useMemo } from 'react'
import { useLeads } from '@/hooks/useLeads'
import { createClient } from '@/lib/supabase/client'
import { updateLead } from '@/lib/leadMutations'
import { calcNextFollowUp } from '@/lib/intervalUtils'
import MobileHeader from '@/components/MobileHeader'
import MainHeader from '@/components/MainHeader'
import FollowUpSidebar from '@/components/FollowUpSidebar'
import MobileSidebarDrawer from '@/components/MobileSidebarDrawer'
import BottomNav from '@/components/BottomNav'
import LeadsTabBar from '@/components/LeadsTabBar'
import LeadsTable from '@/components/LeadsTable'
import AddLeadForm from '@/components/AddLeadForm'
import ClientDetailPopup from '@/components/ClientDetailPopup'

export default function Page() {
  const [search, setSearch]             = useState('')
  const [showAdd, setShowAdd]           = useState(false)
  const [activeTab, setActiveTab]       = useState('all')
  const [selectedLead, setSelectedLead] = useState(null)
  const [drawerOpen, setDrawerOpen]     = useState(false)
  const [mobileView, setMobileView]     = useState('leads')
  const { leads, loading, error }       = useLeads()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  async function handleMarkDone(lead) {
    const nextDate = calcNextFollowUp(lead.interval_days)
    await updateLead(lead.id, { follow_up_date: nextDate })
  }

  const filteredLeads = useMemo(() => {
    let result = leads

    if (activeTab === 'active') {
      result = result.filter(l => l.status !== 'lost')
    } else if (activeTab === 'closed') {
      result = result.filter(l => l.status === 'client')
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(l =>
        l.name?.toLowerCase().includes(q) ||
        l.contact?.toLowerCase().includes(q)
      )
    }

    return result
  }, [leads, activeTab, search])

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-gray-900 overflow-hidden selection:bg-gray-900 selection:text-white">

      {/* ── Modals / popups ── */}
      {showAdd && (
        <AddLeadForm onClose={() => setShowAdd(false)} />
      )}
      {selectedLead && (
        <ClientDetailPopup
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onSaved={() => setSelectedLead(null)}
        />
      )}

      {/* ── Mobile top header (hamburger + logo) ── */}
      <MobileHeader onMenuClick={() => setDrawerOpen(true)} />

      {/* ── Mobile follow-up drawer (slides in from left) ── */}
      <MobileSidebarDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        leads={leads}
        onNewLead={() => { setShowAdd(true); setDrawerOpen(false) }}
        onSignOut={handleSignOut}
        onSelectLead={(lead) => { setSelectedLead(lead); setDrawerOpen(false) }}
        onMarkDone={handleMarkDone}
      />

      {/* ── Desktop sidebar (always visible ≥ md) ── */}
      <FollowUpSidebar
        leads={leads}
        onNewLead={() => setShowAdd(true)}
        onSignOut={handleSignOut}
        onSelectLead={setSelectedLead}
        onMarkDone={handleMarkDone}
      />

      {/* ── Main content area ── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#F9FAFB]">

        {/* Desktop header (hidden on mobile) */}
        <MainHeader
          onNewLead={() => setShowAdd(true)}
          onSearch={setSearch}
          searchValue={search}
        />

        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 pt-0">

          {/* Mobile search bar (hidden on desktop) */}
          <div className="md:hidden pt-4 pb-2">
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 shadow-sm placeholder:text-gray-400"
            />
          </div>

          <LeadsTabBar active={activeTab} onChange={setActiveTab} />

          <LeadsTable
            leads={filteredLeads}
            loading={loading}
            error={error}
            onSelectLead={setSelectedLead}
          />

        </div>
      </main>

      {/* ── Mobile bottom nav (hidden on desktop) ── */}
      <BottomNav
        activeTab={mobileView}
        onLeads={() => setMobileView('leads')}
        onFollowUps={() => {
          setMobileView('followups')
          setDrawerOpen(true)
        }}
        onAdd={() => setShowAdd(true)}
      />

    </div>
  )
}