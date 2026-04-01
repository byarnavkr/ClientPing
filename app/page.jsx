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
  // ─── UI State ───────────────────────────────────────────────
  const [search, setSearch]             = useState('')
  const [showAdd, setShowAdd]           = useState(false)
  const [activeTab, setActiveTab]       = useState('all')
  const [selectedLead, setSelectedLead] = useState(null)

  // Mobile-specific state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mobileTab, setMobileTab]   = useState('leads')

  // Data
  const { leads, loading, error } = useLeads()

  // ─── Auth ───────────────────────────────────────────────────
  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  // ─── Follow-up logic ────────────────────────────────────────
  async function handleMarkDone(lead) {
    const nextDate = calcNextFollowUp(lead.interval_days)
    await updateLead(lead.id, { follow_up_date: nextDate })
  }

  // ─── Filtering ──────────────────────────────────────────────
  const filteredLeads = useMemo(() => {
    let result = leads

    if (activeTab === 'active') {
      result = result.filter(l => !['closed', 'lost'].includes(l.status))
    } else if (activeTab === 'closed') {
      result = result.filter(l => l.status === 'closed')
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
    <div className="flex h-screen bg-[#F9FAFB] text-gray-900 overflow-hidden">

      {/* ───── Modals ───── */}
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

      {/* ───── Mobile Header ───── */}
      <MobileHeader onMenuClick={() => setDrawerOpen(true)} />

      {/* ───── Mobile Sidebar Drawer ───── */}
      <MobileSidebarDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        leads={leads}
        onNewLead={() => setShowAdd(true)}
        onSignOut={handleSignOut}
        onSelectLead={setSelectedLead}
        onMarkDone={handleMarkDone}
      />

      {/* ───── Desktop Sidebar ───── */}
      <FollowUpSidebar
        leads={leads}
        onNewLead={() => setShowAdd(true)}
        onSignOut={handleSignOut}
        onSelectLead={setSelectedLead}
        onMarkDone={handleMarkDone}
      />

      {/* ───── Main Content ───── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Desktop Header */}
        <div className="hidden md:block">
          <MainHeader
            onNewLead={() => setShowAdd(true)}
            onSearch={setSearch}
            searchValue={search}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-24 md:pb-8">

          {/* Desktop Tabs */}
          <div className="hidden md:block">
            <LeadsTabBar
              active={activeTab}
              onChange={setActiveTab}
            />
          </div>

          {/* Leads */}
          <LeadsTable
            leads={filteredLeads}
            loading={loading}
            error={error}
            onSelectLead={setSelectedLead}
          />

        </div>
      </main>

      {/* ───── Bottom Navigation (Mobile Only) ───── */}
      <BottomNav
        activeTab={mobileTab}
        onLeads={() => setMobileTab('leads')}
        onFollowUps={() => {
          setMobileTab('followups')
          setDrawerOpen(true)
        }}
        onAdd={() => setShowAdd(true)}
      />

    </div>
  )
}