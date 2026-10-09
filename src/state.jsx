import { createContext, useContext, useState } from 'react'
import { generate, startOfDay, DAY } from './data/mock.js'
import { PLANS } from './data/gym.js'

const Ctx = createContext(null)
const DUP_WINDOW = 30 * 60 * 1000

export function AppProvider({ children }) {
  const [data, setData] = useState(() => generate())
  const [offline, setOfflineState] = useState(false)
  const [memberId, setMemberId] = useState(() => data.members[0].id)

  const member = (id) => data.members.find((m) => m.id === id)

  // Returns { ok: true } or { ok: false, minutesAgo } when the member already entered < 30 min ago.
  function logEntry(id) {
    const last = data.checkins.find((c) => c.memberId === id)
    if (last && Date.now() - last.at < DUP_WINDOW) {
      return { ok: false, minutesAgo: Math.max(1, Math.round((Date.now() - last.at) / 60000)) }
    }
    const entry = { id: crypto.randomUUID(), memberId: id, at: Date.now(), pending: offline }
    setData((d) => ({ ...d, checkins: [entry, ...d.checkins] }))
    return { ok: true }
  }

  function addMember({ name, phone, plan, photo }) {
    const start = startOfDay()
    const end = start + PLANS[plan].days * DAY
    const m = {
      id: crypto.randomUUID(),
      name,
      phone,
      plan,
      photo: photo || null,
      expiresAt: end,
      joinedAt: start,
      history: [{ plan, start, end, amount: PLANS[plan].price }],
    }
    setData((d) => ({ ...d, members: [m, ...d.members] }))
    return m
  }

  function addExpense({ category, amount, date, note }) {
    const e = { id: crypto.randomUUID(), category, amount: +amount, date, note }
    setData((d) => ({ ...d, expenses: [e, ...d.expenses].sort((a, b) => b.date - a.date) }))
  }

  // Going back online "syncs" queued entries.
  function setOffline(v) {
    setOfflineState(v)
    if (!v) setData((d) => ({ ...d, checkins: d.checkins.map((c) => (c.pending ? { ...c, pending: false } : c)) }))
  }

  function reset() {
    const fresh = generate()
    setData(fresh)
    setOfflineState(false)
    setMemberId(fresh.members[0].id)
  }

  const value = { ...data, offline, memberId, member, setMemberId, logEntry, addMember, addExpense, setOffline, reset }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useApp = () => useContext(Ctx)
