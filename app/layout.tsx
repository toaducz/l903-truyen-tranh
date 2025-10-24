import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Providers from './provider'
import { Suspense } from 'react'
import NProgressInit from '@/component/NProgressInit'
import Navbar from '@/component/navbar'
import Footer from '@/component/footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'L903-Truyện Tranh',
  description: ''
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Suspense>
            <NProgressInit />
          </Suspense>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
