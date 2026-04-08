'use client'

import { useAuth } from '@/app/providers/auth-provider'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  // Check authorization based on route and role
  useEffect(() => {
    if (loading) return

    if (!profile) {
      router.push('/signin')
      return
    }

    // Check admin-specific routes
    if (pathname && (pathname.includes('/admin') || pathname.includes('/business-center'))) {
      if (profile.role !== 'admin') {
        router.push('/dashboard')
        return
      }
    }

    // Check staff-specific routes
    if (pathname && pathname.includes('/staff')) {
      if (!['staff', 'admin'].includes(profile.role)) {
        router.push('/dashboard')
        return
      }
    }

    // Check instructor-specific routes
    if (pathname && pathname.includes('/instructor')) {
      if (!['instructor', 'admin'].includes(profile.role)) {
        router.push('/dashboard')
        return
      }
    }

    // Check student-specific routes
    if (pathname && pathname.includes('/student')) {
      if (!['student', 'admin'].includes(profile.role)) {
        router.push('/dashboard')
        return
      }
    }

    setAuthorized(true)
  }, [profile, loading, router, pathname])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A6C3F]"></div>
      </div>
    )
  }

  if (!profile || !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-[#0A6C3F] text-white rounded-lg hover:bg-[#065f35] transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const navLinks = {
    admin: [
      { href: '/dashboard/admin', label: 'Dashboard', icon: '📊' },
      { href: '/dashboard/admin/business-center', label: 'Business Center', icon: '💼' },
      { href: '/dashboard/admin/users', label: 'Users', icon: '👥' },
      { href: '/dashboard/admin/reports', label: 'Reports', icon: '📈' },
    ],
    staff: [
      { href: '/dashboard/staff', label: 'Dashboard', icon: '📊' },
      { href: '/dashboard/staff/students', label: 'Students', icon: '👨‍🎓' },
      { href: '/dashboard/staff/courses', label: 'Courses', icon: '📚' },
    ],
    instructor: [
      { href: '/dashboard/instructor', label: 'Dashboard', icon: '📊' },
      { href: '/dashboard/instructor/courses', label: 'My Courses', icon: '📚' },
      { href: '/dashboard/instructor/grades', label: 'Grades', icon: '📝' },
    ],
    student: [
      { href: '/dashboard/student', label: 'Dashboard', icon: '📊' },
      { href: '/dashboard/student/courses', label: 'My Courses', icon: '📚' },
      { href: '/dashboard/student/grades', label: 'My Grades', icon: '📊' },
    ],
  }

  const links = navLinks[profile.role as keyof typeof navLinks] || navLinks.student

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-[#0A6C3F] text-white transition-all duration-300 fixed h-screen left-0 top-0 z-40 overflow-y-auto`}
      >
        <div className="p-4 border-b border-green-700 flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full text-left"
          >
            <h1 className={`font-bold ${sidebarOpen ? 'text-lg' : 'text-xs'}`}>
              {sidebarOpen ? 'Brainstorm' : 'BA'}
            </h1>
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 rounded-lg hover:bg-green-700 transition text-sm font-medium ${
                pathname === link.href ? 'bg-green-700' : ''
              }`}
              title={link.label}
            >
              <span className="mr-2">{link.icon}</span>
              {sidebarOpen ? link.label : ''}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-green-700 space-y-2">
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-sm font-medium"
          >
            {sidebarOpen ? 'Sign Out' : 'Out'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Topbar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {profile.full_name || profile.email}
              </h2>
              <p className="text-sm text-gray-600 capitalize">
                {profile.role === 'admin' ? '🔐 Administrator' : profile.role}
              </p>
            </div>
            <img
              src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.email}`}
              alt="Avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
