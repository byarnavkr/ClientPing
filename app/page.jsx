'use client'

import { useState, useMemo } from 'react'
import { useLeads } from '@/hooks/useLeads'
import { createClient } from '@/lib/supabase/client'
import { updateLead } from '@/lib/leadMutations'
import { calcNextFollowUp } from '@/lib/intervalUtils'
import MobileHeader from '@/components/MobileHeader'
import MainHeader from '@/components/MainHeader'
import FollowUpSidebar from '@/components/FollowUpSidebar'
import LeadsTabBar from '@/components/LeadsTabBar'
import LeadsTable from '@/components/LeadsTable'
import AddLeadForm from '@/components/AddLeadForm'
import ClientDetailPopup from '@/components/ClientDetailPopup'

export default function Page() {
  const [search, setSearch]             = useState('')
  const [showAdd, setShowAdd]           = useState(false)
  const [activeTab, setActiveTab]       = useState('all')
  const [selectedLead, setSelectedLead] = useState(null)
  const { leads, loading, error }       = useLeads()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  /**
   * markDone — called when user clicks checklist on a sidebar card.
   *
   * Spec:
   *  - next follow_up_date = TODAY + interval_days
   *  - if no interval_days → clear follow_up_date (set to null)
   *  - ONLY writes follow_up_date — interval_days is never touched
   */
  async function handleMarkDone(lead) {
    const nextDate = calcNextFollowUp(lead.interval_days)
    // nextDate is YYYY-MM-DD string, or null if no interval set
    await updateLead(lead.id, { follow_up_date: nextDate })
    // Realtime subscription in useLeads picks up the change automatically
  }

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
    <div className="flex h-screen bg-[#F9FAFB] text-gray-900 overflow-hidden selection:bg-gray-900 selection:text-white">

      {showAdd && <AddLeadForm onClose={() => setShowAdd(false)} />}

      {selectedLead && (
        <ClientDetailPopup
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onSaved={() => setSelectedLead(null)}
        />
      )}

      <MobileHeader onMenuClick={() => {}} />

      <FollowUpSidebar
        leads={leads}
        onNewLead={() => setShowAdd(true)}
        onSignOut={handleSignOut}
        onSelectLead={setSelectedLead}
        onMarkDone={handleMarkDone}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#F9FAFB]">
        <MainHeader
          onNewLead={() => setShowAdd(true)}
          onSearch={setSearch}
          searchValue={search}
        />
        <div className="flex-1 overflow-y-auto px-8 pb-8 pt-0">
          <LeadsTabBar active={activeTab} onChange={setActiveTab} />
          <LeadsTable
            leads={filteredLeads}
            loading={loading}
            error={error}
            onSelectLead={setSelectedLead}
          />
        </div>
      </main>

    </div>
  )
}