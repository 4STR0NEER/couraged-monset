import { useCallback, useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { AppProvider, useApp } from './state.jsx'
import { statusOf } from './data/mock.js'
import Splash from './components/Splash.jsx'
import Home from './pages/Home.jsx'
import Member from './pages/Member.jsx'
import Admin from './pages/admin/Admin.jsx'

export default function App() {
  const [booted, setBooted] = useState(false)
  const done = useCallback(() => setBooted(true), [])

  return (
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <BrowserRouter>
          <AnimatePresence>{!booted && <Splash key="splash" onDone={done} />}</AnimatePresence>
          {booted && (
            <>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/member" element={<Member />} />
                <Route path="/staff" element={<Stub title="Staff scanner" phase={3} />} />
                <Route path="/admin/*" element={<Admin />} />
              </Routes>
              <RoleSwitcher />
            </>
          )}
        </BrowserRouter>
      </AppProvider>
    </MotionConfig>
  )
}

const ROLES = [
  ['Site', '/'],
  ['Member', '/member'],
  ['Staff', '/staff'],
  ['Admin', '/admin'],
]

// Demo-only view switcher standing in for real logins.
function RoleSwitcher() {
  return (
    <nav
      aria-label="Demo view"
      className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 z-40 flex -translate-x-1/2 rounded-full bg-ink/90 p-1 shadow-[0_8px_24px_-6px_rgb(0_0_0/0.5)] ring-1 ring-paper/10"
    >
      {ROLES.map(([label, to]) => (
        <NavLink key={to} to={to} end={to === '/'} className="relative rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.1em]">
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span layoutId="role-pill" className="absolute inset-0 rounded-full bg-gold" transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }} />
              )}
              <span className={`relative transition-colors duration-150 ${isActive ? 'text-ink' : 'text-ash'}`}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

// Temporary screens until their phase lands; shows the shared state is wired.
function Stub({ title, phase }) {
  const { members, checkins, expenses } = useApp()
  const counts = members.reduce((c, m) => ((c[statusOf(m)] = (c[statusOf(m)] || 0) + 1), c), {})
  return (
    <main className="grid min-h-dvh place-items-center bg-ink px-4 text-paper">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-gold">Phase {phase}</p>
        <h1 className="font-display text-5xl font-black uppercase">{title}</h1>
        <p className="tabular mt-4 text-ash">
          {members.length} members · {counts.active} active · {counts.expiring} expiring · {counts.expired} expired · {checkins.length} check-ins · {expenses.length} expenses
        </p>
      </div>
    </main>
  )
}
