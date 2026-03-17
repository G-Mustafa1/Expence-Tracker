import React from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import Loader from '../components/Loader'

const Dashboard = () => {
  return (
    <div className="min-h-screen flex bg-[#f4f6ff]">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <div className="sticky top-0 z-30 bg-white border-b border-[#e8ecff] px-6 md:px-8 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-[#2b52f3]" />
            <h1 className="text-[15px] font-semibold text-slate-700 tracking-tight">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-[#f4f6ff] px-3 py-1.5 rounded-lg border border-[#e8ecff]">
            <span className="text-base">👋</span>
            <span className="text-sm text-slate-500 font-medium">Welcome back!</span>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-5 md:p-7 pb-20 md:pb-7">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard