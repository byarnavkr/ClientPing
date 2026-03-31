import { Inter } from 'next/font/google'
import './globals.css'
import '../lib/fontawesome'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'

config.autoAddCss = false

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'ClientPing',
  description: 'Pipeline & Follow-ups',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen m-0 p-0 bg-white">
        {children}
      </body>
    </html>
  )
}