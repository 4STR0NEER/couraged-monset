/**
 * Adapted from Kokonut UI "Slide Text Button" (MIT, https://kokonutui.com).
 * Changes: plain <a> instead of next/link, brand variants, no slide-in entrance, custom ease, press feedback.
 */
const VARIANTS = {
  crimson: 'bg-crimson text-paper hover:bg-[#a3001d]',
  gold: 'bg-gold text-ink hover:bg-[#f0b200]',
  ghost: 'border border-paper/25 text-paper hover:bg-paper/10',
}

export default function SlideTextButton({ text, hoverText, variant = 'crimson', className = '', ...props }) {
  return (
    <a
      className={`press group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md px-7 font-display text-lg font-bold uppercase tracking-[0.06em] transition-colors duration-200 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      <span className="relative inline-block transition-transform duration-300 ease-(--ease-out) group-hover:-translate-y-full motion-reduce:transition-none">
        <span className="block transition-opacity duration-300 group-hover:opacity-0">{text}</span>
        <span aria-hidden="true" className="absolute top-full left-0 block w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {hoverText ?? text}
        </span>
      </span>
    </a>
  )
}
