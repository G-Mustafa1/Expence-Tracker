import React from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="bg-white shadow px-4 md:px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg md:text-xl font-semibold text-gray-700">
            Dashboard
          </h1>
          <div className="text-xs md:text-sm text-gray-500">Welcome 👋</div>
        </div>

        {/* Page Content */}
        <div className="p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
