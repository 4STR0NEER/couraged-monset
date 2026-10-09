// All mock data generation. Fixed seed => identical data on every reload (relative to today's date).
import { PLANS } from './gym.js'

const SEED = 20261008
export const DAY = 864e5

function mulberry32(a) {
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const startOfDay = (d = Date.now()) => {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x.getTime()
}

const FIRST_M = ['Juan', 'Jose', 'Mark', 'John Paul', 'Christian', 'Carlo', 'Miguel', 'Paolo', 'Rafael', 'Jerome', 'Kenneth', 'Ramon', 'Arnel', 'Rodel', 'Kristoffer', 'Angelo', 'Vincent', 'Joshua', 'Jericho', 'Renz', 'Aldrin', 'Dindo', 'Rey', 'Nonoy', 'Jun-Jun', 'Elmer', 'Lester']
const FIRST_F = ['Maria', 'Ana', 'Kristine', 'Angelica', 'Jasmine', 'Princess', 'Mary Joy', 'Charisse', 'Patricia', 'Bea', 'Camille', 'Rhea', 'Lovely', 'Nicole', 'Joanna', 'Shiela', 'Grace', 'Hazel', 'Trisha', 'Andrea', 'Kathleen', 'Ella']
const LAST = ['Santos', 'Reyes', 'Cruz', 'Bautista', 'Ocampo', 'Garcia', 'Mendoza', 'Torres', 'Tomas', 'Castillo', 'Flores', 'Villanueva', 'Ramos', 'Rivera', 'Aquino', 'Navarro', 'Salazar', 'Mercado', 'Cabrera', 'Alcantara', 'Dela Cruz', 'Gonzales', 'Lim', 'Tan', 'Uy', 'Go', 'Ybañez', 'Cañete', 'Abellana', 'Pepito', 'Alolor', 'Cabahug', 'Gabisan', 'Sarmiento', 'Lapitan', 'Monteclaro']

// Check-in weight per opening hour (6 = the 6:30–7:00 slot).
const HOUR_W = { 6: 2.2, 7: 4, 8: 3, 9: 1.3, 10: 0.9, 11: 0.8, 12: 0.8, 13: 0.6, 14: 0.6, 15: 0.9, 16: 1.7, 17: 3.6, 18: 4.2, 19: 3.3, 20: 1.5 }
const SUN_W = { 6: 2.5, 7: 3.5, 8: 3.5, 9: 2.5, 10: 1.8, 11: 1.2 }
// Sun..Sat traffic multiplier: busier Mon–Thu, quiet Sunday.
const DOW_F = [0.45, 1.05, 1.0, 1.0, 0.95, 0.8, 0.7]

export const EXPENSE_CATEGORIES = ['Rent', 'Electricity', 'Water', 'Staff salaries', 'Equipment maintenance', 'Supplies', 'Marketing']

export function generate(now = Date.now()) {
  const rand = mulberry32(SEED)
  const pick = (arr) => arr[Math.floor(rand() * arr.length)]
  const int = (a, b) => a + Math.floor(rand() * (b - a + 1))
  const weighted = (w) => {
    const entries = Object.entries(w)
    let r = rand() * entries.reduce((s, [, v]) => s + v, 0)
    for (const [k, v] of entries) if ((r -= v) <= 0) return +k
    return +entries[0][0]
  }
  const uuid = () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (rand() * 16) | 0
      return (c === 'x' ? r : (r & 3) | 8).toString(16)
    })

  const today = startOfDay(now)

  // ---- Members -------------------------------------------------------------
  const members = []
  for (let i = 0; i < 150; i++) {
    const bucket = ['active', 'active', 'active', 'active', 'active', 'active', 'active', 'expiring', 'expired', 'expired'][i % 10]
    const pr = rand()
    const plan = i === 0 ? 'Quarterly' : pr < 0.55 ? 'Monthly' : pr < 0.85 ? 'Quarterly' : 'Annual'
    const days = PLANS[plan].days
    const offset = bucket === 'active' ? int(8, days) : bucket === 'expiring' ? int(0, 7) : -int(1, 150)
    const expiresAt = today + offset * DAY // valid through the end of this day

    const history = []
    let end = expiresAt
    let p = plan
    do {
      const start = end - PLANS[p].days * DAY
      history.push({ plan: p, start, end, amount: PLANS[p].price })
      end = start
      if (rand() < 0.2) p = pick(['Monthly', 'Quarterly', 'Annual'])
    } while (rand() < 0.82 && end > today - 420 * DAY)

    const female = rand() < 0.42
    members.push({
      id: uuid(),
      name: `${pick(female ? FIRST_F : FIRST_M)} ${pick(LAST)}`,
      phone: '09' + String(int(100000000, 999999999)),
      plan,
      expiresAt,
      joinedAt: history[history.length - 1].start,
      history,
      photo: null,
    })
  }
  // The one real person photo in resources/ becomes the featured member.
  Object.assign(members[0], { name: 'Paolo Abellana', photo: '/assets/gym-training.jpg', photoPos: '50% 28%' })

  // ---- Check-ins (from the 1st of the month three months back, so monthly charts are whole) ----
  const first = new Date(today)
  const from = new Date(first.getFullYear(), first.getMonth() - 3, 1).getTime()
  const checkins = []
  let n = 0
  for (let d = from; d <= today; d += DAY) {
    const dow = new Date(d).getDay()
    const count = Math.round(62 * DOW_F[dow] * (0.85 + rand() * 0.3))
    const weights = dow === 0 ? SUN_W : HOUR_W
    const seen = new Set() // one visit per member per day
    const at = () => {
      const h = weighted(weights)
      return new Date(d).setHours(h, h === 6 ? int(30, 59) : int(0, 59), int(0, 59))
    }
    for (let k = 0; k < count; k++) {
      const t = at()
      if (t > now) continue
      for (let tries = 0; tries < 6; tries++) {
        const m = pick(members)
        if (!seen.has(m.id) && m.history.some((h) => t >= h.start && t < h.end + DAY)) {
          seen.add(m.id)
          checkins.push({ id: 'c' + n++, memberId: m.id, at: t })
          break
        }
      }
    }
    const walkIns = Math.round(int(2, 7) * DOW_F[dow])
    for (let k = 0; k < walkIns; k++) {
      const t = at()
      if (t <= now) checkins.push({ id: 'c' + n++, memberId: null, walkIn: true, amount: PLANS['Day Pass'].price, at: t })
    }
  }
  checkins.sort((a, b) => b.at - a.at)

  // ---- Expenses --------------------------------------------------------------
  const expenses = []
  let e = 0
  const add = (date, category, amount, note) => date <= now && expenses.push({ id: 'e' + e++, date, category, amount, note })
  for (let m = new Date(from); m.getTime() <= today; m.setMonth(m.getMonth() + 1)) {
    const y = m.getFullYear()
    const mo = m.getMonth()
    const on = (day) => new Date(y, mo, day, 10).getTime()
    add(on(1), 'Rent', 25000, '3rd floor lease')
    add(on(10), 'Electricity', int(12000, 17000), 'VECO bill (aircon load)')
    add(on(12), 'Water', int(1200, 2200), 'MCWD bill')
    add(on(15), 'Staff salaries', 18000, '1st half payroll')
    add(on(28), 'Staff salaries', 18000, '2nd half payroll')
    add(on(int(3, 26)), 'Equipment maintenance', int(1500, 8500), pick(['Treadmill belt service', 'Cable replacement', 'Bench upholstery', 'Smith machine lube']))
    add(on(int(2, 12)), 'Supplies', int(1200, 3500), pick(['Cleaning supplies', 'Drinking water refill', 'Chalk & wipes']))
    if (rand() < 0.7) add(on(int(5, 25)), 'Marketing', int(1000, 5000), pick(['Facebook boost', 'Tarpaulin print', 'Flyers']))
  }
  expenses.sort((a, b) => b.date - a.date)

  return { members, checkins, expenses }
}

// ---- Shared helpers ------------------------------------------------------------
export const daysLeft = (m, now = Date.now()) => Math.round((m.expiresAt - startOfDay(now)) / DAY)

export function statusOf(m, now = Date.now()) {
  const left = daysLeft(m, now)
  return left < 0 ? 'expired' : left <= 7 ? 'expiring' : 'active'
}

export const initials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

// Quick sanity check: `node src/data/mock.js`
if (typeof process !== 'undefined' && import.meta.url === `file:///${process.argv[1]?.replace(/\\/g, '/')}`) {
  const a = generate(Date.UTC(2026, 9, 8, 10))
  const b = generate(Date.UTC(2026, 9, 8, 10))
  console.assert(JSON.stringify(a) === JSON.stringify(b), 'seed must be deterministic')
  const counts = a.members.reduce((c, m) => ((c[statusOf(m, Date.UTC(2026, 9, 8, 10))] = (c[statusOf(m, Date.UTC(2026, 9, 8, 10))] || 0) + 1), c), {})
  console.assert(a.members.length === 150, '150 members')
  console.assert(counts.active > 90 && counts.expired > 15, 'status mix ~70/10/20')
  console.log({ counts, checkins: a.checkins.length, expenses: a.expenses.length })
}
