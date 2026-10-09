import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { animate, createScope, stagger } from 'animejs'
import { AirVent, ArrowLeft, ArrowRight, ArrowUpRight, Car, Clock, Droplets, MapPin, MessageCircle, Phone, ShowerHead, UserRound, Wifi } from 'lucide-react'
import { AMENITIES, COACHES, GYM, PLANS, openStatus, peso } from '../data/gym.js'
import SlideTextButton from '../components/kokonutui/slide-text-button.jsx'
import { CountUp, EASE_IN_OUT, EASE_OUT } from '../components/ui.jsx'


const Sample = ({ children = 'Sample', dark }) => (
  <span className={`inline-block rounded-sm px-1.5 py-0.5 align-middle text-[0.65rem] font-bold uppercase tracking-[0.14em] ${dark ? 'bg-paper/10 text-ash' : 'bg-ink/8 text-smoke'}`}>
    {children}
  </span>
)

// Section heading whose lines rise out of a mask when scrolled into view.
function Heading({ lines, className = '' }) {
  return (
    <motion.h2
      className={`font-display text-5xl font-black uppercase leading-[0.9] md:text-6xl ${className}`}
      initial="out"
      whileInView="in"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ staggerChildren: 0.08 }}
    >
      {lines.map((l, k) => (
        <span key={k} className="block overflow-hidden pb-1">
          <motion.span className="block" variants={{ out: { y: '110%' }, in: { y: '0%' } }} transition={{ duration: 0.75, ease: EASE_OUT }}>
            {l}
          </motion.span>
        </span>
      ))}
    </motion.h2>
  )
}

// Story-style progress bar. Its CSS animation is the timer: when it ends, onDone advances the slide.
function Progress({ state, run, dur, paused, onDone }) {
  return (
    <span className="mt-2 block h-0.5 overflow-hidden rounded-full bg-paper/20">
      <span
        key={run}
        onAnimationEnd={state === 'active' ? onDone : undefined}
        className={`block h-full origin-left bg-gold ${state === 'active' ? 'fill' : state === 'done' ? '' : 'scale-x-0'}`}
        style={{ '--dur': `${dur}s`, animationPlayState: paused ? 'paused' : 'running' }}
      />
    </span>
  )
}

export default function Home() {
  return (
    <div className="bg-mist pb-16">
      <Header />
      <Hero />
      <Marquee />
      <Floor />
      <Coaches />
      <Membership />
      <Amenities />
      <Visit />
      <Footer />
    </div>
  )
}

function Header() {
  const links = [
    ['Coaches', '#coaches'],
    ['Membership', '#membership'],
    ['Amenities', '#amenities'],
    ['Visit', '#visit'],
  ]
  return (
    <header className="sticky top-0 z-30 bg-ink text-paper">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <img src="/assets/logo.jpg" alt="" className="size-10 mix-blend-lighten" />
          <span className="font-display text-xl font-extrabold uppercase leading-none tracking-[0.04em]">
            CourageD <span className="text-gold">Fitness Hub</span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Sections">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="text-sm font-semibold uppercase tracking-[0.12em] text-ash transition-colors duration-150 hover:text-gold">
              {label}
            </a>
          ))}
        </nav>
        <a href="#membership" className="press rounded-md bg-crimson px-4 py-2 font-display text-base font-bold uppercase tracking-[0.06em]">
          Join
        </a>
      </div>
    </header>
  )
}

const HERO_SLIDES = [
  { src: '/assets/gym-dumbbells.jpg', label: 'Free weights', alt: 'Dumbbell racks and benches on green turf', pos: '70% 50%' },
  { src: '/assets/gym-cardio.jpg', label: 'Cardio deck', alt: 'Spin bikes and curved treadmills by the window', pos: '60% 50%' },
  { src: '/assets/gym-training.jpg', label: 'Strength floor', alt: 'A member doing barbell curls between plate racks', pos: '58% 30%' },
  { src: '/assets/gym-smith.jpg', label: 'Smith & racks', alt: 'Close-up of the Smith machine bar', pos: '50% 50%' },
]
const HERO_DWELL = 6 // seconds per photo: slow pan, then a quick wipe

function Hero() {
  const root = useRef(null)
  const [slide, setSlide] = useState({ i: 0, n: 0 }) // n only grows: React key + stacking order
  const go = (i) => setSlide((s) => (i === s.i ? s : { i, n: s.n + 1 }))
  const status = openStatus()

  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const fgY = useTransform(scrollYProgress, [0, 1], [0, -140])
  const fgOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  useLayoutEffect(() => {
    const scope = createScope({ root, mediaQueries: { reduce: '(prefers-reduced-motion: reduce)' } }).add((self) => {
      if (self.matches.reduce) return
      animate('.line > span', { y: ['105%', '0%'], duration: 800, delay: stagger(90, { start: 150 }), ease: 'out(4)' })
      animate('.rise', { opacity: [0, 1], y: [14, 0], duration: 600, delay: stagger(70, { start: 520 }), ease: 'out(4)' })
    })
    return () => scope.revert()
  }, [])

  const s = HERO_SLIDES[slide.i]
  return (
    <section id="top" ref={root} className="relative isolate overflow-hidden bg-ink text-paper">
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
        <AnimatePresence>
          <motion.div
            key={slide.n}
            style={{ zIndex: slide.n }}
            className="absolute inset-0 overflow-hidden"
            initial={{ clipPath: 'inset(0 0 0 100%)' }}
            animate={{ clipPath: 'inset(0 0 0 0%)' }}
            exit={{ clipPath: 'inset(0 0 0 0%)', transition: { duration: 0.8 } }} // hold until covered
            transition={{ duration: 0.8, ease: EASE_IN_OUT }}
          >
            <motion.img
              src={s.src}
              alt={s.alt}
              style={{ objectPosition: s.pos }}
              className="h-full w-full object-cover"
              initial={{ scale: 1.18, x: '1.5%' }}
              animate={{ scale: 1.05, x: '-1.5%' }}
              transition={{ duration: HERO_DWELL + 1.2, ease: 'linear' }}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className="absolute inset-0 -z-5 bg-linear-to-r from-ink via-ink/80 to-ink/10 max-md:bg-linear-to-t max-md:via-ink/75" />

      <motion.div
        style={{ y: fgY, opacity: fgOpacity }}
        className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl flex-col justify-end px-4 pt-28 pb-24 sm:px-8 md:justify-center"
      >
        <p className="rise mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-paper/15 bg-ink/60 px-3 py-1.5 text-sm font-semibold">
          <span className={`size-2 rounded-full ${status.open ? 'bg-active' : 'bg-ash'}`} aria-hidden="true" />
          {status.label}
        </p>
        <h1 className="font-display text-[clamp(3.6rem,10vw,6rem)] font-black uppercase leading-[0.86] tracking-[-0.01em] text-balance">
          <span className="line block overflow-hidden pb-1"><span className="block">Courage,</span></span>
          <span className="line block overflow-hidden pb-1"><span className="block text-gold">one rep</span></span>
          <span className="line block overflow-hidden pb-1"><span className="block">at a time.</span></span>
        </h1>
        <p className="rise mt-6 max-w-md text-lg text-paper/80">
          Air-conditioned strength and cardio gym on Miñoza St., Talamban. Free weights, machines, coaches, and a locker and shower waiting after.
        </p>
        <div className="rise mt-8 flex flex-wrap gap-3">
          <SlideTextButton href="#membership" text="See membership" hoverText="Pick your plate" />
          <SlideTextButton href={GYM.facebook} target="_blank" rel="noreferrer" variant="ghost" text="Message us" hoverText="On Facebook" />
        </div>
        <div className="rise mt-12 flex max-w-xl gap-3" aria-label="Gym photos">
          {HERO_SLIDES.map((h, k) => (
            <button key={h.label} type="button" onClick={() => go(k)} aria-label={`Show ${h.label}`} aria-current={k === slide.i} className="group flex-1 py-1 text-left">
              <span className={`hidden text-xs font-bold uppercase tracking-[0.12em] transition-colors duration-200 sm:block ${k === slide.i ? 'text-paper' : 'text-ash group-hover:text-paper'}`}>
                {h.label}
              </span>
              <Progress
                state={k === slide.i ? 'active' : k < slide.i ? 'done' : 'todo'}
                run={slide.n}
                dur={HERO_DWELL}
                onDone={() => go((slide.i + 1) % HERO_SLIDES.length)}
              />
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

const wrap = (min, max, v) => ((((v - min) % (max - min)) + (max - min)) % (max - min)) + min
const MARQUEE = ['Strength', 'Cardio', 'Coaching', 'Air-conditioned', 'Talamban, Cebu', 'Open 6:30 AM']

// Drifts on its own; scrolling speeds it up and flips its direction.
function Marquee() {
  const reduce = useReducedMotion()
  const base = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(velocity, [-1000, 0, 1000], [-5, 0, 5], { clamp: false })
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`)
  const dir = useRef(1)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    const b = boost.get()
    if (b < -0.05) dir.current = -1
    else if (b > 0.05) dir.current = 1
    base.set(base.get() - dir.current * 2.2 * (delta / 1000) * (1 + Math.abs(b)))
  })

  const row = MARQUEE.flatMap((w) => [w, '·'])
  return (
    <div className="overflow-hidden border-y border-paper/10 bg-ink py-4 text-paper" aria-hidden="true">
      <motion.div className="flex w-max whitespace-nowrap" style={{ x }}>
        {[0, 1].map((copy) => (
          <span key={copy} className="flex">
            {row.concat(row).map((w, k) => (
              <span key={k} className={`px-4 font-display text-3xl font-extrabold uppercase ${w === '·' ? 'text-crimson' : k % 4 === 2 ? 'text-gold' : ''}`}>
                {w}
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

function Floor() {
  const shots = [
    ['/assets/gym-cardio.jpg', 'Cardio deck', 'Spin bikes and curved treadmills by the window', 'md:row-span-2'],
    ['/assets/gym-training.jpg', 'Free weights', 'EZ bars, plates and racks', ''],
    ['/assets/gym-smith.jpg', 'Smith & racks', 'Guided bar work for heavy days', ''],
  ]
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-8 md:py-28">
      <div className="grid gap-10 md:grid-cols-[1fr_1.6fr] md:gap-14">
        <div className="md:pt-6">
          <Heading lines={['Built for', 'the work.']} />
          <p className="mt-5 max-w-prose text-lg text-smoke">
            {GYM.about.text} <Sample>Sample copy</Sample>
          </p>
          <dl className="mt-8 flex gap-10">
            <div>
              <dt className="text-sm font-semibold uppercase tracking-[0.12em] text-smoke">Since</dt>
              <dd className="tabular font-display text-4xl font-extrabold">{GYM.about.founded}</dd>
            </div>
            <div>
              <dt className="text-sm font-semibold uppercase tracking-[0.12em] text-smoke">Members</dt>
              <dd className="tabular font-display text-4xl font-extrabold">{GYM.about.members}</dd>
            </div>
            <div className="self-end pb-2">
              <Sample />
            </div>
          </dl>
        </div>
        <div className="grid gap-3 md:grid-cols-2 md:grid-rows-2">
          {shots.map(([src, title, caption, span], k) => (
            <motion.figure
              key={title}
              className={`group relative min-h-56 overflow-hidden rounded-lg bg-ink ${span}`}
              initial={{ clipPath: 'inset(100% 0 0 0)' }}
              whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, delay: k * 0.12, ease: EASE_IN_OUT }}
            >
              <motion.img
                src={src}
                alt={caption}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-(--ease-out) group-hover:scale-[1.04]"
                initial={{ y: '-8%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 1.2, delay: k * 0.12, ease: EASE_OUT }}
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/90 to-transparent p-4 pt-12 text-paper">
                <span className="block font-display text-2xl font-extrabold uppercase leading-none">{title}</span>
                <span className="text-sm text-paper/75">{caption}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}

// Until real coach photos arrive, each slide pans across a gym photo behind a placeholder.
const COACH_STAGES = ['/assets/gym-smith.jpg', '/assets/gym-cardio.jpg', '/assets/gym-dumbbells.jpg']
const COACH_DWELL = 6.5
const reveal = {
  out: { opacity: 0, y: 28, filter: 'blur(6px)' },
  in: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE_OUT } },
}

function Coaches() {
  const stage = useRef(null)
  const inView = useInView(stage, { amount: 0.4 })
  const [seen, setSeen] = useState(false)
  const [i, setI] = useState(0)
  const [run, setRun] = useState(0)
  const [hover, setHover] = useState(false)
  useEffect(() => void (inView && setSeen(true)), [inView])

  const go = (k) => {
    setI((k + COACHES.length) % COACHES.length)
    setRun((r) => r + 1)
  }
  const next = COACHES[(i + 1) % COACHES.length]

  return (
    <section id="coaches" className="overflow-hidden bg-ink py-20 text-paper md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Heading lines={['Your corner,', <span className="text-gold">three coaches deep.</span>]} />
          <p className="max-w-sm text-ash">Swipe or use the arrows. Photos and specialties are placeholders until the team sends theirs.</p>
        </div>

        <div
          ref={stage}
          role="region"
          aria-roledescription="carousel"
          aria-label="Coaches"
          className="relative mt-12 overflow-hidden rounded-xl"
          onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
          onPointerLeave={(e) => e.pointerType === 'mouse' && setHover(false)}
        >
          <motion.div
            className="flex touch-pan-y"
            animate={{ x: `${-i * 100}%` }}
            transition={{ duration: 0.65, ease: EASE_IN_OUT }}
            onPanEnd={(_, { offset, velocity }) => {
              if (offset.x < -60 || velocity.x < -400) go(i + 1)
              else if (offset.x > 60 || velocity.x > 400) go(i - 1)
            }}
          >
            {COACHES.map((c, k) => (
              <CoachSlide key={c.name} coach={c} backdrop={COACH_STAGES[k]} active={k === i && seen} />
            ))}
          </motion.div>

          <button
            type="button"
            onClick={() => go(i + 1)}
            className="press absolute top-5 right-5 hidden items-center gap-3 rounded-lg bg-ink/70 p-2 pr-4 text-left ring-1 ring-paper/10 md:flex"
          >
            <img src={next.photo || COACH_STAGES[(i + 1) % COACHES.length]} alt="" className="size-12 rounded-md object-cover" />
            <span>
              <span className="block text-xs font-bold uppercase tracking-[0.12em] text-ash">Up next</span>
              <span className="font-display text-xl font-extrabold uppercase leading-none">{next.name}</span>
            </span>
          </button>
        </div>

        <div className="mt-5 flex items-center gap-6">
          <div className="flex flex-1 gap-3">
            {COACHES.map((c, k) => (
              <button key={c.name} type="button" onClick={() => go(k)} aria-label={`Show ${c.name}`} aria-current={k === i} className="group flex-1 py-1 text-left">
                <span className={`text-xs font-bold uppercase tracking-[0.12em] transition-colors duration-200 ${k === i ? 'text-paper' : 'text-ash group-hover:text-paper'}`}>
                  <span className="hidden sm:inline">Coach </span>
                  {c.name.split(' ')[1]}
                </span>
                <Progress state={k === i ? 'active' : k < i ? 'done' : 'todo'} run={run} dur={COACH_DWELL} paused={hover || !inView} onDone={() => go(i + 1)} />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(i - 1)} aria-label="Previous coach" className="press grid size-11 place-items-center rounded-full ring-1 ring-paper/20 transition-colors hover:bg-paper/10">
              <ArrowLeft className="size-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(i + 1)} aria-label="Next coach" className="press grid size-11 place-items-center rounded-full bg-gold text-ink">
              <ArrowRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function CoachSlide({ coach, backdrop, active }) {
  const first = coach.name.split(' ')[1]
  return (
    <div className="relative h-[36rem] w-full shrink-0 overflow-hidden md:h-[min(78vh,44rem)]" inert={!active}>
      <motion.img
        src={coach.photo || backdrop}
        alt={coach.photo ? coach.name : ''}
        className="absolute inset-0 h-full w-full object-cover"
        initial={false}
        animate={active ? { scale: 1.06, x: '-2%' } : { scale: 1.2, x: '2%' }}
        // Slow pan while showing; reset only after the slide has left the frame.
        transition={active ? { duration: COACH_DWELL + 0.8, ease: 'linear' } : { duration: 0, delay: 0.7 }}
      />
      {!coach.photo && (
        <>
          <div className="absolute inset-0 bg-ink/70" />
          <span aria-hidden="true" className="absolute -top-10 right-4 font-display text-[22rem] font-black leading-none text-transparent [-webkit-text-stroke:2px_rgb(254_190_16/0.3)] md:right-16 md:text-[32rem]">
            {first[0]}
          </span>
          <div className="absolute top-[14%] right-[10%] flex flex-col items-center gap-3 text-ash max-md:left-0 max-md:right-0 md:top-1/2 md:-translate-y-1/2">
            <UserRound strokeWidth={1} className="size-28 md:size-44" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">Photo coming soon</span>
          </div>
        </>
      )}
      <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/30 to-transparent md:bg-linear-to-r md:from-ink/90 md:via-ink/30" />

      <motion.div
        className="absolute inset-x-0 bottom-0 max-w-2xl p-6 md:p-12"
        initial="out"
        animate={active ? 'in' : 'out'}
        variants={{ in: { transition: { staggerChildren: 0.07, delayChildren: 0.4 } }, out: { transition: { duration: 0 } } }}
      >
        <motion.p variants={reveal} className="text-sm font-bold uppercase tracking-[0.16em] text-gold">
          {coach.role}
        </motion.p>
        <motion.h3 variants={reveal} className="font-display text-7xl font-black uppercase leading-[0.85] md:text-9xl">
          {coach.name}
        </motion.h3>
        <motion.ul variants={reveal} className="mt-5 flex flex-wrap gap-2">
          {coach.focus.map((f) => (
            <li key={f} className="rounded-full bg-paper/10 px-3 py-1 text-sm font-semibold ring-1 ring-paper/15">
              {f}
            </li>
          ))}
          {coach.placeholder && (
            <li className="self-center">
              <Sample dark />
            </li>
          )}
        </motion.ul>
        <motion.div variants={reveal} className="mt-7">
          <SlideTextButton href={GYM.facebook} target="_blank" rel="noreferrer" variant="gold" text={`Train with ${first}`} hoverText="Message us on Facebook" />
        </motion.div>
      </motion.div>
    </div>
  )
}

// Bumper-plate colours follow the competition convention: white light, black, yellow, red heaviest.
const PLATES = [
  { plan: 'Day Pass', label: '1', unit: 'day', size: '18%', cls: 'bg-paper text-ink ring-ink/15' },
  { plan: 'Monthly', label: '30', unit: 'days', size: '22%', cls: 'bg-ink-2 text-paper ring-paper/15' },
  { plan: 'Quarterly', label: '90', unit: 'days', size: '26%', cls: 'bg-gold text-ink ring-ink/15' },
  { plan: 'Annual', label: '365', unit: 'days', size: '30%', cls: 'bg-crimson text-paper ring-paper/20' },
]

function Membership() {
  const [sel, setSel] = useState('Quarterly')
  const plan = PLANS[sel]
  const perDay = plan.price / plan.days
  const best = Object.entries(PLANS).reduce((a, b) => (b[1].price / b[1].days < a[1].price / a[1].days ? b : a))[0]
  const swap = {
    initial: { opacity: 0, y: 10, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -8, filter: 'blur(4px)', transition: { duration: 0.14 } },
    transition: { duration: 0.26, ease: EASE_OUT },
  }

  return (
    <section id="membership" className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Heading lines={['Pick your plate.']} />
          <p className="max-w-sm text-smoke">
            The heavier the commitment, the lighter the price per day. <Sample>Sample pricing</Sample>
          </p>
        </div>

        <div className="mt-12 grid items-end gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div role="radiogroup" aria-label="Membership plans" className="relative">
            {/* The row owns the in-view trigger: plates start off-screen, so they can't observe themselves. */}
            <motion.div
              className="flex items-end justify-between gap-[1.5%]"
              initial="out"
              whileInView="in"
              viewport={{ once: true, margin: '-80px' }}
              transition={{ staggerChildren: 0.08 }}
            >
              {PLATES.map((p) => {
                const on = p.plan === sel
                return (
                  <motion.div
                    key={p.plan}
                    style={{ width: p.size }}
                    className="shrink-0"
                    variants={{ out: { x: -90, rotate: -160, opacity: 0 }, in: { x: 0, rotate: 0, opacity: 1 } }}
                    transition={{ duration: 0.8, ease: EASE_OUT }}
                  >
                    <motion.button
                      type="button"
                      role="radio"
                      aria-checked={on}
                      aria-label={`${p.plan}, ${peso(PLANS[p.plan].price)}`}
                      onClick={() => setSel(p.plan)}
                      className={`relative aspect-square w-full rounded-full shadow-[0_10px_24px_-8px_rgb(25_23_27/0.45)] ring-[3px] ring-inset ${p.cls} ${on ? 'outline-[3px] outline-offset-4 outline-gold' : ''}`}
                      animate={{ y: on ? -18 : 0, rotate: on ? 0 : -6 }}
                      whileHover={{ rotate: on ? 0 : 8 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ y: { type: 'spring', duration: 0.4, bounce: 0.25 }, rotate: { type: 'spring', duration: 0.5, bounce: 0.3 }, scale: { duration: 0.12 } }}
                    >
                      <span aria-hidden="true" className="absolute inset-[9%] rounded-full border border-current opacity-25" />
                      <span aria-hidden="true" className="absolute top-1/2 left-1/2 size-[18%] -translate-1/2 rounded-full bg-mist ring-2 ring-ink/30" />
                      <span className="absolute inset-x-0 top-[16%] text-center font-display text-[clamp(0.9rem,3.2vw,2.4rem)] leading-none font-black">{p.label}</span>
                      <span className="absolute inset-x-0 bottom-[17%] text-center text-[clamp(0.5rem,1.2vw,0.75rem)] font-bold uppercase tracking-[0.16em] opacity-80">{p.unit}</span>
                    </motion.button>
                  </motion.div>
                )
              })}
            </motion.div>
            <div aria-hidden="true" className="h-2 rounded-full bg-ink" />
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.12em] text-smoke">Tap a plate</p>
          </div>

          <div className="rounded-xl bg-ink p-7 text-paper">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={sel} {...swap} className="flex items-center justify-between gap-3">
                <h3 className="font-display text-3xl font-extrabold uppercase">{sel}</h3>
                {sel === best && <span className="rounded-sm bg-gold px-2 py-1 text-xs font-bold uppercase tracking-[0.12em] text-ink">Best per day</span>}
              </motion.div>
            </AnimatePresence>
            <p className="tabular mt-2 font-display text-7xl font-black leading-none text-gold">
              <CountUp value={plan.price} format={peso} />
            </p>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={sel} {...swap}>
                <p className="tabular mt-3 text-ash">{plan.days === 1 ? 'Single walk-in visit' : `${plan.days} days of access · about ${peso(perDay)} a day`}</p>
                <ul className="mt-6 space-y-2 border-t border-paper/10 pt-5 text-paper/85">
                  <li>Full gym floor, cardio deck and free weights</li>
                  <li>{AMENITIES.slice(1).join(', ')}</li>
                  <li>{plan.days === 1 ? 'Pay at the front desk' : 'Personal QR pass for quick check-in'}</li>
                </ul>
              </motion.div>
            </AnimatePresence>
            <SlideTextButton href={GYM.facebook} target="_blank" rel="noreferrer" className="mt-7 w-full" text={plan.days === 1 ? 'Walk in today' : 'Sign up'} hoverText="Message us on Facebook" />
          </div>
        </div>
      </div>
    </section>
  )
}

const AMENITY_ICONS = [Car, Wifi, AirVent, Droplets, ShowerHead]

function Amenities() {
  return (
    <section id="amenities" className="bg-gold py-16 text-ink md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <Heading lines={['Included with every visit']} className="text-4xl! md:text-5xl!" />
        <motion.ul
          className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-ink/20"
          initial="out"
          whileInView="in"
          viewport={{ once: true, margin: '-60px' }}
          transition={{ staggerChildren: 0.07 }}
        >
          {AMENITIES.map((a, i) => {
            const Icon = AMENITY_ICONS[i]
            return (
              <motion.li
                key={a}
                className="flex flex-col gap-3 lg:px-6 lg:first:pl-0"
                variants={{ out: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              >
                <motion.span
                  className="w-fit"
                  variants={{ out: { scale: 0.6, rotate: -20 }, in: { scale: 1, rotate: 0 } }}
                  transition={{ type: 'spring', duration: 0.6, bounce: 0.35 }}
                >
                  <Icon className="size-9" strokeWidth={1.75} aria-hidden="true" />
                </motion.span>
                <span className="font-display text-2xl font-extrabold uppercase leading-none">{a}</span>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}

function Visit() {
  const today = new Date().getDay()
  const status = openStatus()
  const fmt = (t) => new Date(2000, 0, 1, +t.slice(0, 2), +t.slice(3)).toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit' })
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(GYM.mapsQuery)}`

  return (
    <section id="visit" className="mx-auto max-w-7xl px-4 py-20 sm:px-8 md:py-28">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <Heading lines={['Come train.']} />
          <address className="mt-6 flex gap-3 text-lg not-italic">
            <MapPin className="mt-1 size-5 shrink-0 text-crimson" aria-hidden="true" />
            {GYM.address}
          </address>
          <div className="mt-8">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-smoke">
              <Clock className="size-4" aria-hidden="true" /> Hours
              <span className={`ml-2 rounded-sm px-1.5 py-0.5 normal-case tracking-normal ${status.open ? 'bg-active/12 text-active' : 'bg-ink/8 text-smoke'}`}>{status.label}</span>
            </h3>
            <table className="tabular mt-3 w-full max-w-sm text-left">
              <tbody>
                {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                  const h = GYM.hours[d]
                  return (
                    <tr key={d} className={d === today ? 'font-bold' : 'text-smoke'}>
                      <td className="py-1">
                        {d === today && <span className="mr-2 inline-block size-1.5 rounded-full bg-crimson align-middle" aria-hidden="true" />}
                        {h.day}
                      </td>
                      <td className="py-1 text-right">
                        {fmt(h.open)} – {fmt(h.close)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={GYM.phoneHref} className="press inline-flex items-center gap-2 rounded-md bg-ink px-4 py-3 font-semibold text-paper">
              <Phone className="size-4 text-gold" aria-hidden="true" /> {GYM.phone}
            </a>
            <a href={GYM.facebook} target="_blank" rel="noreferrer" className="press inline-flex items-center gap-2 rounded-md border border-ink/15 px-4 py-3 font-semibold">
              <MessageCircle className="size-4 text-crimson" aria-hidden="true" /> couragedfitnesshub
            </a>
          </div>
        </div>
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <iframe
            title="Map to CourageD Fitness Hub"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(GYM.mapsQuery)}&z=17&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="min-h-80 w-full flex-1 rounded-xl border-0 bg-ink/5 grayscale-[0.3]"
          />
          <a href={directions} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 self-end text-sm font-semibold underline decoration-gold decoration-2 underline-offset-4">
            Get directions in Google Maps <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-ink text-ash">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm sm:px-8">
        <span className="flex items-center gap-2">
          <img src="/assets/logo.jpg" alt="" className="size-8 mix-blend-lighten" />© {new Date().getFullYear()} {GYM.name}
        </span>
        <span>Prototype · membership data is simulated</span>
      </div>
    </footer>
  )
}
