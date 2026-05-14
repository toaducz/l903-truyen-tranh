import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'
import Providers from './provider'
import Navbar from '@/component/navbar'
import Footer from '@/component/footer'
import { AuthProvider } from './auth-provider'
import ScrollToTopButton from '@/component/chapter/scroll-to-top'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'vietnamese'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin', 'vietnamese'],
  weight: ['200', '300', '400', '500', '600', '700', '800']
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
      <script
        defer
        src='https://umami.l903.site/script.js'
        data-website-id='ee2732a0-d135-4ce4-914e-80d5da557069'
      ></script>
      <body className={`${inter.variable} ${manrope.variable} font-sans antialiased`}>
        <Providers>
          <AuthProvider>
            <Navbar />
            {children}
            <ScrollToTopButton />
            <Footer />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
