import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { QRCodeSVG } from 'qrcode.react'
import { CalendarCheck, Expand, X } from 'lucide-react'
import { useApp } from '../state.jsx'
import { DAY, daysLeft, startOfDay, statusOf } from '../data/mock.js'
import { PLANS } from '../data/gym.js'
import { Avatar, CountUp, EASE_OUT, StatusBadge, fmtDate, fmtTime } from '../components/ui.jsx'
import DemoMenu, { DemoLabel } from '../components/DemoMenu.jsx'

const BAR = { active: 'bg-active', expiring: 'bg-expiring', expired: 'bg-expired' }

export default function Member() {
  const { members, checkins, memberId, member: find } = useApp()
  const m = find(memberId) ?? members[0]
  const [big, setBig] = useState(false)

  const status = statusOf(m)
  const left = daysLeft(m)
  const period = m.history[0]
  const total = Math.round((period.end - period.start) / DAY)
  const remaining = Math.max(0, Math.min(1, (left + 1) / total))
  const visits = checkins.filter((c) => c.memberId === m.id)
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()
  const thisMonth = visits.filter((c) => c.at >= monthStart).length

  return (
    <main className="min-h-dvh bg-ink pb-28 text-paper">
      <MemberDemo />
      <div className="mx-auto max-w-md px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <header className="flex h-12 items-center gap-2">
          <img src="/assets/logo.jpg" alt="" className="size-9 mix-blend-lighten" />
          <span className="font-display text-lg font-extrabold uppercase tracking-[0.04em]">
            CourageD <span className="text-gold">Pass</span>
          </span>
        </header>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.12 } }}
            transition={{ duration: 0.32, ease: EASE_OUT }}
          >
            <h1 className="mt-4 font-display text-4xl font-black uppercase leading-none">Hi, {m.name.split(' ')[0]}</h1>

            {/* Pass */}
            <section aria-label="Membership pass" className="mt-5 overflow-hidden rounded-2xl bg-paper text-ink shadow-[0_24px_48px_-20px_rgb(0_0_0/0.7)]">
              <div className="flex items-center gap-3 p-4">
                <Avatar member={m} className="size-14 text-xl" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-2xl font-extrabold uppercase leading-tight">{m.name}</p>
                  <p className="text-sm text-smoke">{m.plan} member</p>
                </div>
                <StatusBadge status={status} solid />
              </div>

              <button
                type="button"
                onClick={() => setBig(true)}
                className="group relative mx-auto block w-[78%] pb-2"
                aria-label="Enlarge QR code"
              >
                {/* One layoutId owner at a time, so the code morphs between card and fullscreen. */}
                {big ? (
                  <div className="aspect-square" />
                ) : (
                  <motion.div layoutId="qr" transition={{ duration: 0.35, ease: EASE_OUT }} className="rounded-xl bg-paper">
                    <Qr value={m.id} />
                  </motion.div>
                )}
                <span className="mt-1 flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-smoke">
                  <Expand className="size-3.5" aria-hidden="true" /> Tap to enlarge
                </span>
              </button>

              <div className="relative mt-2 border-t-2 border-dashed border-ink/15 px-4 py-3">
                {/* ticket notches */}
                <span aria-hidden="true" className="absolute -top-3 -left-3 size-6 rounded-full bg-ink" />
                <span aria-hidden="true" className="absolute -top-3 -right-3 size-6 rounded-full bg-ink" />
                <p className="text-center text-sm text-smoke">
                  {status === 'expired' ? 'Renew at the front desk to reactivate this pass.' : 'Show this at the front desk to check in.'}
                </p>
                <p className="tabular mt-1 text-center text-[0.7rem] tracking-[0.12em] text-smoke/80 uppercase">ID {m.id.slice(0, 8)}</p>
              </div>
            </section>

            {/* Days remaining */}
            <section className="mt-4 rounded-2xl bg-ink-2 p-5 ring-1 ring-paper/5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="tabular font-display text-6xl font-black leading-none">
                    <CountUp value={Math.abs(left)} />
                  </p>
                  <p className="mt-1 font-semibold text-ash">
                    {left < 0 ? `days since expiry` : left === 1 ? 'day left' : 'days left'}
                  </p>
                </div>
                <p className="text-right text-sm text-ash">
                  {left < 0 ? 'Expired' : 'Valid until'}
                  <br />
                  <span className="font-semibold text-paper">{fmtDate(m.expiresAt, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </p>
              </div>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-paper/10" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={Math.max(0, left)} aria-label="Days remaining">
                <motion.div
                  className={`h-full origin-left rounded-full ${BAR[status]}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: remaining }}
                  transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT }}
                />
              </div>
              <p className="mt-2 text-xs text-ash">
                {period.plan} · {PLANS[period.plan].days} days · started {fmtDate(period.start, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </section>

            {/* Visits */}
            <section className="mt-4 rounded-2xl bg-ink-2 p-5 ring-1 ring-paper/5">
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-2xl font-extrabold uppercase">Recent visits</h2>
                <p className="tabular text-sm text-ash">
                  <span className="font-bold text-gold">{thisMonth}</span> this month
                </p>
              </div>
              {visits.length === 0 ? (
                <p className="mt-4 text-ash">No visits yet. Your first check-in will show up here.</p>
              ) : (
                <ol className="mt-3 divide-y divide-paper/8">
                  {visits.slice(0, 8).map((c, k) => (
                    <motion.li
                      key={c.id}
                      className="flex items-center gap-3 py-2.5"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + k * 0.04, ease: EASE_OUT }}
                    >
                      <CalendarCheck className="size-4 text-gold" aria-hidden="true" />
                      <span className="flex-1 font-semibold">{dayLabel(c.at)}</span>
                      <span className="tabular text-ash">{fmtTime(c.at)}</span>
                    </motion.li>
                  ))}
                </ol>
              )}
            </section>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {big && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-paper p-6"
            onClick={() => setBig(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            <button type="button" aria-label="Close" className="press absolute top-[max(1rem,env(safe-area-inset-top))] right-4 grid size-11 place-items-center rounded-full bg-ink/8 text-ink">
              <X className="size-5" aria-hidden="true" />
            </button>
            <div className="w-full max-w-sm text-center text-ink">
              <motion.div layoutId="qr" transition={{ duration: 0.35, ease: EASE_OUT }} className="rounded-xl bg-paper">
                <Qr value={m.id} />
              </motion.div>
              <p className="mt-4 font-display text-3xl font-extrabold uppercase">{m.name}</p>
              <p className="text-smoke">Turn your screen brightness up for a faster scan.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

function Qr({ value }) {
  return (
    <QRCodeSVG
      value={value}
      size={512}
      level="H"
      marginSize={2}
      fgColor="#19171B"
      bgColor="#FFFFFF"
      imageSettings={{ src: '/assets/icon-192.png', width: 96, height: 96, excavate: true }}
      className="h-auto w-full"
      title={`Member QR code ${value}`}
    />
  )
}

function dayLabel(t) {
  const diff = Math.round((startOfDay() - startOfDay(t)) / DAY)
  return diff === 0 ? 'Today' : diff === 1 ? 'Yesterday' : fmtDate(t)
}

function MemberDemo() {
  const { members, memberId, setMemberId } = useApp()
  const firstOf = (s) => members.find((m) => statusOf(m) === s)
  return (
    <DemoMenu>
      <DemoLabel>Show member</DemoLabel>
      <div className="grid grid-cols-3 gap-1.5">
        {['active', 'expiring', 'expired'].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setMemberId(firstOf(s).id)}
            className="press rounded-lg bg-paper/8 px-2 py-2 text-xs font-bold uppercase tracking-[0.06em] hover:bg-paper/12"
          >
            {s}
          </button>
        ))}
      </div>
      <select
        value={memberId}
        onChange={(e) => setMemberId(e.target.value)}
        aria-label="Pick any member"
        className="w-full rounded-lg bg-ink px-3 py-2 text-sm text-paper ring-1 ring-paper/15"
      >
        {[...members]
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} · {statusOf(m)}
            </option>
          ))}
      </select>
    </DemoMenu>
  )
}
