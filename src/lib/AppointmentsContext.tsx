'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/AuthContext'

export interface UpcomingAppointment {
  id: string
  service_name: string
  preferred_date: string
  preferred_time: string
  status: string
}

interface AppointmentsContextType {
  appointments: UpcomingAppointment[]
  loading: boolean
  refresh: () => Promise<void>
}

const AppointmentsContext = createContext<AppointmentsContextType>({
  appointments: [],
  loading: true,
  refresh: async () => {},
})

export function AppointmentsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<UpcomingAppointment[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!user) {
      setAppointments([])
      setLoading(false)
      return
    }

    setLoading(true)
    const { data } = await supabase
      .from('bookings')
      .select('id, preferred_date, preferred_time, status, services(name)')
      .eq('user_id', user.id)
      .in('status', ['pending', 'confirmed'])
      .order('preferred_date', { ascending: true })

    const mapped: UpcomingAppointment[] = (data || []).map((b: any) => ({
      id: b.id,
      service_name: b.services?.name || 'Service',
      preferred_date: b.preferred_date,
      preferred_time: b.preferred_time,
      status: b.status,
    }))

    setAppointments(mapped)
    setLoading(false)
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <AppointmentsContext.Provider value={{ appointments, loading, refresh }}>
      {children}
    </AppointmentsContext.Provider>
  )
}

export function useAppointments() {
  return useContext(AppointmentsContext)
}