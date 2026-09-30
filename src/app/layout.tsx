import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { AuthProvider } from '@/lib/AuthContext'
import { AppointmentsProvider } from '@/lib/AppointmentsContext'

export const metadata: Metadata = {
  title: 'The Braid Atelier | Braids, Locs & Styles',
  description: 'We specialise in braids, locs and stylish hair solutions designed to bring out your unique beauty.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        <AuthProvider>
          <AppointmentsProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </AppointmentsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}