'use client'

import { useAuth } from '@/app/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const { profile, loading } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalStaff: 0,
    totalRevenue: 0,
  })
  const [dashboardLoading, setDashboardLoading] = useState(true)

  useEffect(() => {
    if (loading) return

    // Verify admin access
    if (!profile || profile.role !== 'admin') {
      router.push('/dashboard')
      return
    }

    setIsAuthorized(true)
    loadStats()
  }, [profile, loading, router])

  const loadStats = async () => {
    try {
      // TODO: Replace with actual API calls to fetch stats
      setStats({
        totalUsers: 254,
        totalStudents: 180,
        totalStaff: 42,
        totalRevenue: 125400,
      })
    } finally {
      setDashboardLoading(false)
    }
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A6C3F] mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A6C3F] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Admin Badge */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-center gap-3">
        <span className="text-2xl">🔐</span>
        <div>
          <p className="font-semibold text-blue-900">Administrator Access</p>
          <p className="text-sm text-blue-700">This dashboard is restricted to administrators only.</p>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card-hover">
          <p className="text-gray-600 text-sm font-medium">Total Users</p>
          <p className="text-3xl font-bold text-[#0A6C3F] mt-2">{stats.totalUsers}</p>
        </div>

        <div className="card-hover">
          <p className="text-gray-600 text-sm font-medium">Total Students</p>
          <p className="text-3xl font-bold text-[#0A6C3F] mt-2">{stats.totalStudents}</p>
        </div>

        <div className="card-hover">
          <p className="text-gray-600 text-sm font-medium">Staff Members</p>
          <p className="text-3xl font-bold text-[#0A6C3F] mt-2">{stats.totalStaff}</p>
        </div>

        <div className="card-hover">
          <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
          <p className="text-3xl font-bold text-[#0A6C3F] mt-2">
            ${stats.totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Admin Actions</h3>
          <div className="space-y-3">
            <a href="/dashboard/admin/business-center" className="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition">
              <p className="font-semibold text-[#0A6C3F]">💼 Business Center Management</p>
              <p className="text-sm text-gray-600">Manage branches, services, and revenue</p>
            </a>
            <a href="/dashboard/admin/users" className="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition">
              <p className="font-semibold text-[#0A6C3F]">👥 User Management</p>
              <p className="text-sm text-gray-600">View and manage all users</p>
            </a>
            <a href="/dashboard/admin/reports" className="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition">
              <p className="font-semibold text-[#0A6C3F]">📈 Reports & Analytics</p>
              <p className="text-sm text-gray-600">View system-wide reports</p>
            </a>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded">
              <span className="text-sm font-medium text-gray-700">Database</span>
              <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-semibold">✓ Connected</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded">
              <span className="text-sm font-medium text-gray-700">Authentication</span>
              <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-semibold">✓ Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded">
              <span className="text-sm font-medium text-gray-700">Admin Access</span>
              <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-semibold">✓ Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
