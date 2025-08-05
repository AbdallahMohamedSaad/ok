import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Competitor Monitor SaaS',
  description: 'Monitor and analyze your competitors on Facebook and Instagram',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <nav className="border-b">
            <div className="flex h-16 items-center px-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold">Competitor Monitor</h1>
                <nav className="flex items-center space-x-6 text-sm font-medium">
                  <a href="/dashboard" className="transition-colors hover:text-foreground/80">
                    Dashboard
                  </a>
                  <a href="/competitors/add" className="transition-colors hover:text-foreground/80">
                    Add Page
                  </a>
                  <a href="/reports" className="transition-colors hover:text-foreground/80">
                    Reports
                  </a>
                  <a href="#" className="transition-colors hover:text-foreground/80">
                    Settings
                  </a>
                </nav>
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}