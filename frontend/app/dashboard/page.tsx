'use client'

import { useAuth } from '@/app/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && profile) {
      // Redirect based on role
      const redirectMap: Record<string, string> = {
        admin: '/dashboard/admin',
        staff: '/dashboard/staff',
        instructor: '/dashboard/instructor',
        student: '/dashboard/student',
      }
      const redirectPath = redirectMap[profile.role] || '/dashboard/student'
      router.push(redirectPath)
    }
  }, [profile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A6C3F]"></div>
      </div>
    )
  }

  return null
}
