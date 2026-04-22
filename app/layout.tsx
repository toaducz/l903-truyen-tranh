import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'
import Providers from './provider'
import { Suspense } from 'react'
import NProgressInit from '@/component/NProgressInit'
import Navbar from '@/component/navbar'
import Footer from '@/component/footer'
import { AuthProvider } from './auth-provider'

const beVietnamPro = Be_Vietnam_Pro({
  variable: '--font-be-vietnam-pro',
  subsets: ['vietnamese'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
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
      <body className={`${beVietnamPro.variable} font-sans antialiased`}>
        <Providers>
          <Suspense>
            <NProgressInit />
          </Suspense>
          <AuthProvider>
            <Navbar />
            {children}
            <Footer />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
