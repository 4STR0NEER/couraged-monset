import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CircleAlert, CircleCheck, CircleX, Users, LogIn, Wallet } from 'lucide-react'
import { useApp } from '../../state.jsx'
import { DAY, startOfDay, statusOf } from '../../data/mock.js'
import { peso } from '../../data/gym.js'
import { CountUp, EASE_OUT, fmtDate } from '../../components/ui.jsx'

// Validated (dataviz validator, light surface): revenue/expense pair passes CVD + contrast.
const C = { revenue: '#A87800', expense: '#BA0021', checkins: '#A87800', grid: '#E4E2E6', axis: '#5E5A63' }
// Sequential single-hue ramp (gold), light -> dark, for the heatmap.
const RAMP = ['#FFF7DD', '#FFE8A3', '#FED45E', '#FEBE10', '#D69B00', '#9C6F00']
const DOWS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DOW_IDX = [1, 2, 3, 4, 5, 6, 0] // display order -> Date.getDay()
const HOURS = Array.from({ length: 15 }, (_, k) => k + 6) // 6 AM .. 8 PM
const hourLabel = (h) => `${h % 12 || 12}${h < 12 ? 'a' : 'p'}`
const shortPeso = (v) => (v >= 1000 ? `₱${Math.round(v / 1000)}k` : peso(v))

function useStats() {
  const { members, checkins, expenses } = useApp()
  return useMemo(() => {
    const now = Date.now()
    const today = startOfDay(now)
    const d = new Date(today)
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1).getTime()
    const prevMonthStart = new Date(d.getFullYear(), d.getMonth() - 1, 1).getTime()
    const rangeStart = new Date(d.getFullYear(), d.getMonth() - 3, 1).getTime()
    const from90 = today - 89 * DAY

    const status = { active: 0, expiring: 0, expired: 0 }
    members.forEach((m) => status[statusOf(m, now)]++)

    const revenueIn = (a, b) =>
      members.reduce((s, m) => s + m.history.reduce((t, h) => t + (h.start >= a && h.start < b ? h.amount : 0), 0), 0) +
      checkins.reduce((s, c) => s + (c.walkIn && c.at >= a && c.at < b ? c.amount : 0), 0)
    const spentIn = (a, b) => expenses.reduce((s, e) => s + (e.date >= a && e.date < b ? e.amount : 0), 0)

    // Daily series + heatmap + weekday averages over the last 90 days.
    const daily = Array.from({ length: 90 }, (_, k) => ({ t: from90 + k * DAY, count: 0 }))
    const heat = DOW_IDX.map(() => HOURS.map(() => 0))
    const perDow = Array(7).fill(0)
    const dowDays = Array(7).fill(0)
    daily.forEach((x) => dowDays[new Date(x.t).getDay()]++)
    for (const c of checkins) {
      if (c.at < from90) continue
      const i = Math.floor((c.at - from90) / DAY)
      if (daily[i]) daily[i].count++
      const dt = new Date(c.at)
      perDow[dt.getDay()]++
      const h = HOURS.indexOf(dt.getHours())
      if (h >= 0) heat[DOW_IDX.indexOf(dt.getDay())][h]++
    }
    const heatAvg = heat.map((row, r) => row.map((v) => v / dowDays[DOW_IDX[r]]))
    const heatMax = Math.max(...heatAvg.flat())
    const busiest = DOW_IDX.map((g, k) => ({ day: DOWS[k], avg: Math.round((perDow[g] / dowDays[g]) * 10) / 10 }))

    const months = []
    for (let m = new Date(rangeStart); m.getTime() <= today; m.setMonth(m.getMonth() + 1)) {
      const a = m.getTime()
      const b = new Date(m.getFullYear(), m.getMonth() + 1, 1).getTime()
      const current = a === monthStart
      months.push({ month: m.toLocaleDateString('en-PH', { month: 'short' }) + (current ? ' (to date)' : ''), revenue: revenueIn(a, b), expenses: spentIn(a, b) })
    }

    const byCat = {}
    expenses.forEach((e) => e.date >= rangeStart && (byCat[e.category] = (byCat[e.category] || 0) + e.amount))
    const categories = Object.entries(byCat)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)

    const todayCount = checkins.filter((c) => c.at >= today).length
    const yesterdaySoFar = checkins.filter((c) => c.at >= today - DAY && c.at < now - DAY).length

    return {
      total: members.length,
      status,
      todayCount,
      yesterdaySoFar,
      revenueMonth: revenueIn(monthStart, now + 1),
      revenuePrevSameDay: revenueIn(prevMonthStart, prevMonthStart + (now - monthStart)),
      daily,
      heatAvg,
      heatMax,
      busiest,
      months,
      categories,
      rangeStart,
    }
  }, [members, checkins, expenses])
}

export default function Overview() {
  const s = useStats()
  return (
    <div className="mx-auto max-w-[90rem]">
      <header className="flex flex-wrap items-end justify-between gap-3 pr-24">
        <div>
          <h1 className="font-display text-5xl font-black uppercase leading-none">Overview</h1>
          <p className="mt-1 text-smoke">{fmtDate(Date.now(), { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <p className="flex items-center gap-2 text-sm font-semibold text-smoke">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-active opacity-60 motion-reduce:animate-none" />
            <span className="relative size-2 rounded-full bg-active" />
          </span>
          Live · updates as staff scan members in
        </p>
      </header>

      <Kpis s={s} />

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <Panel title="Peak hours" note="Average check-ins per hour, last 90 days" className="xl:col-span-3" i={0}>
          <Heatmap avg={s.heatAvg} max={s.heatMax} />
        </Panel>
        <Panel title="Busiest days" note="Average check-ins per day of week" className="xl:col-span-2" i={1}>
          <BusiestDays data={s.busiest} />
        </Panel>
        <Panel title="Check-ins per day" note="Last 90 days, members and walk-ins" className="xl:col-span-5" i={2}>
          <DailyChart data={s.daily} />
        </Panel>
        <Panel title="Revenue vs expenses" note={`By month since ${fmtDate(s.rangeStart, { month: 'long', day: 'numeric' })}`} className="xl:col-span-3" i={3}>
          <MoneyChart data={s.months} />
        </Panel>
        <Panel title="Expenses by category" note={`Total since ${fmtDate(s.rangeStart, { month: 'long', day: 'numeric' })}`} className="xl:col-span-2" i={4}>
          <CategoryChart data={s.categories} />
        </Panel>
      </div>
    </div>
  )
}

function Panel({ title, note, className = '', children, i }) {
  return (
    <motion.section
      className={`min-w-0 rounded-xl bg-paper p-5 ring-1 ring-ink/5 ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 + i * 0.07, ease: EASE_OUT }}
    >
      <h2 className="font-display text-2xl font-extrabold uppercase leading-none">{title}</h2>
      <p className="mt-1 text-sm text-smoke">{note}</p>
      <div className="mt-4">{children}</div>
    </motion.section>
  )
}

function Kpis({ s }) {
  const delta = s.todayCount - s.yesterdaySoFar
  const revDelta = s.revenueMonth - s.revenuePrevSameDay
  const items = [
    { label: 'Total members', value: s.total, Icon: Users, note: 'All plans' },
    { label: 'Active', value: s.status.active, Icon: CircleCheck, tone: 'text-active', note: `${Math.round((s.status.active / s.total) * 100)}% of members` },
    { label: 'Expiring this week', value: s.status.expiring, Icon: CircleAlert, tone: 'text-[#9A7000]', note: 'Due for renewal' },
    { label: 'Expired', value: s.status.expired, Icon: CircleX, tone: 'text-expired', note: 'Win-back list' },
    { label: 'Check-ins today', value: s.todayCount, Icon: LogIn, note: `${delta >= 0 ? '+' : ''}${delta} vs this time yesterday` },
    { label: 'Revenue this month', value: s.revenueMonth, Icon: Wallet, fmt: peso, note: `${revDelta >= 0 ? '+' : '−'}${peso(Math.abs(revDelta))} vs last month` },
  ]
  return (
    <motion.dl
      className="mt-6 grid grid-cols-2 overflow-hidden rounded-xl bg-paper ring-1 ring-ink/5 md:grid-cols-3 xl:grid-cols-6"
      initial="out"
      animate="in"
      transition={{ staggerChildren: 0.05 }}
    >
      {items.map((k) => (
        <motion.div
          key={k.label}
          className="border-ink/8 p-5 not-last:border-r max-md:[&:nth-child(2n)]:border-r-0 md:max-xl:[&:nth-child(3n)]:border-r-0 max-xl:border-b"
          variants={{ out: { opacity: 0, y: 10 }, in: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } } }}
        >
          <dt className="flex items-center gap-2 text-sm font-semibold text-smoke">
            <k.Icon className={`size-4 ${k.tone ?? 'text-smoke'}`} aria-hidden="true" />
            {k.label}
          </dt>
          <dd className="tabular mt-2 font-display text-4xl font-black leading-none xl:text-[2.6rem]">
            <CountUp value={k.value} format={k.fmt ? (v) => k.fmt(v) : (v) => Math.round(v)} duration={0.9} />
          </dd>
          <dd className="tabular mt-1.5 text-xs text-smoke">{k.note}</dd>
        </motion.div>
      ))}
    </motion.dl>
  )
}

function Heatmap({ avg, max }) {
  const [hover, setHover] = useState(null)
  const step = (v) => (v <= 0 ? null : RAMP[Math.min(RAMP.length - 1, Math.floor((v / max) * RAMP.length))])
  return (
    <div>
      <p className="tabular h-5 text-sm font-semibold" aria-live="polite">
        {hover ? `${DOWS[hover.r]} ${hourLabel(HOURS[hover.c])}m · ${hover.r === 6 && HOURS[hover.c] >= 12 ? 'closed' : avg[hover.r][hover.c].toFixed(1) + ' check-ins on average'}` : <span className="text-smoke">Hover a cell for the exact average</span>}
      </p>
      <div className="mt-2 grid grid-cols-[2.5rem_repeat(15,minmax(0,1fr))] gap-[2px]" role="table" aria-label="Average check-ins by day and hour">
        <span />
        {HOURS.map((h) => (
          <span key={h} className="pb-1 text-center text-[0.68rem] text-smoke">
            {h % 2 === 0 ? hourLabel(h) : ''}
          </span>
        ))}
        {avg.map((row, r) => (
          <div key={r} role="row" className="contents">
            <span role="rowheader" className="self-center text-xs font-semibold text-smoke">
              {DOWS[r]}
            </span>
            {row.map((v, c) => (
              <motion.span
                key={c}
                role="cell"
                aria-label={`${DOWS[r]} ${hourLabel(HOURS[c])}m: ${v.toFixed(1)}`}
                onPointerEnter={() => setHover({ r, c })}
                onPointerLeave={() => setHover(null)}
                className={`aspect-[1.4] rounded-[3px] ${hover && hover.r === r && hover.c === c ? 'ring-2 ring-ink' : ''}`}
                style={{ background: step(v) ?? 'var(--color-mist)' }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.4 + (r + c) * 0.018, ease: EASE_OUT }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-smoke">
        Quiet
        <span className="flex">
          {RAMP.map((c) => (
            <span key={c} className="h-2.5 w-7 first:rounded-l-sm last:rounded-r-sm" style={{ background: c }} />
          ))}
        </span>
        Busy
      </div>
    </div>
  )
}

const axis = { stroke: C.axis, fontSize: 12, tickLine: false, axisLine: false }

function Tip({ active, payload, label, fmt = (v) => v, labelFmt = (l) => l }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg bg-ink px-3 py-2 text-sm text-paper shadow-[0_8px_24px_-8px_rgb(0_0_0/0.5)]">
      <p className="text-xs text-ash">{labelFmt(label)}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="tabular flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ background: p.color }} aria-hidden="true" />
          {p.name}: <b>{fmt(p.value)}</b>
        </p>
      ))}
    </div>
  )
}

function DailyChart({ data }) {
  return (
    <div className="h-64">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="ci" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FEBE10" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#FEBE10" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="t" {...axis} tickFormatter={(t) => fmtDate(t, { month: 'short', day: 'numeric' })} minTickGap={48} />
          <YAxis {...axis} width={44} allowDecimals={false} />
          <Tooltip cursor={{ stroke: C.axis, strokeDasharray: '3 3' }} content={<Tip labelFmt={(t) => fmtDate(t)} />} />
          <Area type="monotone" dataKey="count" name="Check-ins" stroke={C.checkins} strokeWidth={2} fill="url(#ci)" animationDuration={900} animationEasing="ease-out" activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function BusiestDays({ data }) {
  const max = Math.max(...data.map((d) => d.avg))
  return (
    <div className="h-64">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 4, left: -16, bottom: 0 }}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="day" {...axis} />
          <YAxis {...axis} width={44} />
          <Tooltip cursor={{ fill: 'rgb(25 23 27 / 0.04)' }} content={<Tip fmt={(v) => `${v} avg`} />} />
          <Bar dataKey="avg" name="Check-ins" radius={[4, 4, 0, 0]} animationDuration={800} animationEasing="ease-out" maxBarSize={44}
            shape={(p) => <rect x={p.x} y={p.y} width={p.width} height={p.height} rx={4} fill={p.payload.avg === max ? "#19171B" : C.checkins} />}>
            <LabelList dataKey="avg" position="top" fontSize={12} fill="#19171B" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function MoneyChart({ data }) {
  return (
    <>
    <p className="flex justify-end gap-4 text-sm text-smoke">
      {[['Revenue', C.revenue], ['Expenses', C.expense]].map(([n, c]) => (
        <span key={n} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full" style={{ background: c }} aria-hidden="true" />
          {n}
        </span>
      ))}
    </p>
    <div className="h-72">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 4, left: 4, bottom: 0 }} barGap={2}>
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="month" {...axis} />
          <YAxis {...axis} width={52} tickFormatter={shortPeso} />
          <Tooltip cursor={{ fill: 'rgb(25 23 27 / 0.04)' }} content={<Tip fmt={peso} />} />
          <Bar dataKey="revenue" name="Revenue" fill={C.revenue} radius={[4, 4, 0, 0]} maxBarSize={48} animationDuration={800}>
            <LabelList dataKey="revenue" position="top" fontSize={11} fill="#19171B" formatter={shortPeso} />
          </Bar>
          <Bar dataKey="expenses" name="Expenses" fill={C.expense} radius={[4, 4, 0, 0]} maxBarSize={48} animationDuration={800} animationBegin={120}>
            <LabelList dataKey="expenses" position="top" fontSize={11} fill="#19171B" formatter={shortPeso} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
    </>
  )
}

function CategoryChart({ data }) {
  return (
    <div className="h-72">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 48, left: 0, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="category" {...axis} width={150} tick={{ fill: '#19171B', fontSize: 13 }} />
          <Tooltip cursor={{ fill: 'rgb(25 23 27 / 0.04)' }} content={<Tip fmt={peso} />} />
          <Bar dataKey="amount" name="Spent" fill={C.expense} radius={[0, 4, 4, 0]} barSize={18} animationDuration={800}>
            <LabelList dataKey="amount" position="right" fontSize={12} fill="#19171B" formatter={shortPeso} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
