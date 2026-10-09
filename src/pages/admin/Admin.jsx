import { NavLink, Route, Routes } from 'react-router'
import { motion } from 'motion/react'
import { LayoutDashboard, Receipt, Users, Zap } from 'lucide-react'
import { useApp } from '../../state.jsx'
import { statusOf } from '../../data/mock.js'
import DemoMenu, { DemoLabel } from '../../components/DemoMenu.jsx'
import Overview from './Overview.jsx'

const NAV = [
  ['Overview', '/admin', LayoutDashboard],
  ['Members', '/admin/members', Users],
  ['Expenses', '/admin/expenses', Receipt],
]

export default function Admin() {
  return (
    <div className="min-h-dvh bg-mist pb-20 lg:grid lg:grid-cols-[15rem_1fr] lg:pb-0">
      <AdminDemo />
      <aside className="sticky top-0 z-20 bg-ink text-paper lg:h-dvh">
        <div className="flex h-14 items-center gap-2.5 px-4 lg:h-20 lg:px-5">
          <img src="/assets/logo.jpg" alt="" className="size-9 mix-blend-lighten" />
          <span className="font-display text-lg font-extrabold uppercase leading-none tracking-[0.04em]">
            CourageD <span className="block text-gold">Admin</span>
          </span>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-2 pb-2 lg:flex-col lg:px-3">
          {NAV.map(([label, to, Icon]) => (
            <NavLink key={to} to={to} end className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold">
              {({ isActive }) => (
                <>
                  {isActive && <motion.span layoutId="admin-nav" className="absolute inset-0 rounded-lg bg-paper/10" transition={{ type: 'spring', duration: 0.35, bounce: 0.1 }} />}
                  {isActive && <motion.span layoutId="admin-nav-bar" className="absolute top-2 bottom-2 left-0 w-0.5 rounded-full bg-gold max-lg:hidden" />}
                  <Icon className={`relative size-4 ${isActive ? 'text-gold' : 'text-ash'}`} aria-hidden="true" />
                  <span className={`relative ${isActive ? 'text-paper' : 'text-ash'}`}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="members" element={<Soon title="Members" phase={5} />} />
          <Route path="expenses" element={<Soon title="Expenses" phase={6} />} />
        </Routes>
      </main>
    </div>
  )
}

function Soon({ title, phase }) {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-smoke">Phase {phase}</p>
        <h1 className="font-display text-5xl font-black uppercase">{title}</h1>
      </div>
    </div>
  )
}

// Until the scanner lands, the presenter can push a live check-in to watch the dashboard react.
function AdminDemo() {
  const { members, logEntry } = useApp()
  const simulate = () => {
    const pool = members.filter((m) => statusOf(m) !== 'expired')
    for (let k = 0; k < 10; k++) if (logEntry(pool[Math.floor(Math.random() * pool.length)].id).ok) return
  }
  return (
    <DemoMenu>
      <DemoLabel>Live data</DemoLabel>
      <button type="button" onClick={simulate} className="press flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-3 py-2 text-sm font-bold text-ink">
        <Zap className="size-4" aria-hidden="true" /> Simulate a check-in
      </button>
    </DemoMenu>
  )
}
