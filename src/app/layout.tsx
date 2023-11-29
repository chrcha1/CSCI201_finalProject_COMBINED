import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './css/main.css'
import "bootstrap/dist/css/bootstrap.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Smart Scheduler',
  description: 'CSCI201 Final Project',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
