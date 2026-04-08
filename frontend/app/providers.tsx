'use client'

import { AuthProvider } from '@/app/providers/auth-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
