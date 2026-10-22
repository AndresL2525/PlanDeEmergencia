import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
      <Sidebar open={menuAbierto} onClose={() => setMenuAbierto(false)} />
      <div className="min-w-0 flex-1">
        <Navbar onMenuClick={() => setMenuAbierto(true)} />
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
