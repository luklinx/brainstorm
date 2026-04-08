'use client'

import { useState, useEffect } from 'react'

interface Branch {
  id: number
  name: string
  location: string
  revenue: number
}

export default function BusinessCenter() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBusinessCenterData()
  }, [])

  const loadBusinessCenterData = async () => {
    try {
      // TODO: Replace with actual API calls
      // const response = await fetch('/api/business-center/branches')
      setBranches([
        { id: 1, name: 'Main Branch', location: 'Campus', revenue: 5200 },
        { id: 2, name: 'North Branch', location: 'North Campus', revenue: 3800 },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Business Center</h1>
        <button className="btn-primary">Add Branch</button>
      </div>

      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <p className="text-gray-600 text-sm">Total Branches</p>
            <p className="text-3xl font-bold text-[#0A6C3F]">{branches.length}</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-[#0A6C3F]">
              ${branches.reduce((sum, b) => sum + b.revenue, 0)}
            </p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm">Active Services</p>
            <p className="text-3xl font-bold text-[#0A6C3F]">24</p>
          </div>
        </div>

        {/* Branches List */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Branches</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Location</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Revenue</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {branches.map(branch => (
                  <tr key={branch.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{branch.name}</td>
                    <td className="py-3 px-4">{branch.location}</td>
                    <td className="py-3 px-4">${branch.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <button className="text-[#0A6C3F] hover:underline text-sm">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
