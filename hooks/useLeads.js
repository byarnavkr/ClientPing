'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useLeads() {
  const [leads, setLeads]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)
  const supabaseRef = useRef(null)

  useEffect(() => {
    // Reuse a single client instance for both fetch + realtime
    if (!supabaseRef.current) {
      supabaseRef.current = createClient()
    }
    const supabase = supabaseRef.current

    let channel

    async function init() {
      // Wait for session to be ready (critical after OAuth redirect)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setLoading(false)
        return
      }

      // Initial fetch
      await fetchLeads()

      // Subscribe to all changes — refetch on every event
      // Refetching is more reliable than patching state when
      // RLS filters are active (ensures only owned rows show)
      channel = supabase
        .channel('leads-all')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'leads' },
          () => fetchLeads()
        )
        .subscribe((status) => {
          if (status === 'CHANNEL_ERROR') {
            console.warn('Realtime channel error — will retry on next mount')
          }
        })
    }

    async function fetchLeads() {
      setError(null)
      const { data, error } = await supabaseRef.current
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setLeads(data ?? [])
      }
      setLoading(false)
    }

    init()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  return { leads, loading, error }
}