# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Primary (pitch audience):** the owner of CourageD Fitness Hub, watching a live sales demo on a laptop and phones. They decide whether to commission the system.
- **Personas the demo plays:** front-desk staff scanning member QR codes at the door (phone, glanced at between greetings); members opening their QR pass on their phone at the entrance; the owner/admin reviewing members, check-ins, revenue and expenses on a laptop.
- **Home page visitor:** prospective members in Talamban, Cebu City deciding whether to join.

## Product Purpose
A clickable prototype of a gym membership system: QR check-in, member portal, admin dashboard, plus a public home page. Success = the owner can picture running their gym on it after a 10-minute demo. No backend; all data is seeded mock data held in app state.

## Positioning
Built for this one gym: its logo, photos, coaches and Cebu context (₱, Filipino names), not a generic SaaS template.

## Operating Context
Shown live in a pitch meeting. Camera scanning must work over HTTPS on iPhone Safari and Android Chrome, with demo-menu fallbacks if the camera fails. Installable to home screen.

## Capabilities and Constraints
- Roles switched by a fixed role switcher (Admin / Staff / Member); no real auth.
- Mock data is deterministic (fixed seed). Actions (log entry, add member, add expense) update dashboards live; "Reset demo data" restores.
- Stack: React + Vite + Tailwind v4, React Router, Recharts, qrcode.react, qr-scanner, anime.js, Motion, Kokonut UI. Static deploy on Vercel.

## Brand Commitments
- Name: **CourageD Fitness Hub** (logo wordmark "CouRageD").
- Logo: `public/assets/logo.jpg` (gold figures, red script, black ground).
- Palette pinned by client: #FFFFFF, #F2F2F2, #FEBE10 (gold), #BA0021 (crimson), #19171B (ink).
- Loading screen: logo centered, "CourageD Fitness Hub" beneath, a heartbeat-like light pulse.
- Motion: sharp yet pleasing.

## Evidence on Hand
- Real: logo; four gym photos (`public/assets/gym-*.jpg`): training, cardio, dumbbell area, Smith machine.
- Real: address 3rd Floor CRD Bldg., Miñoza St., Talamban, Cebu City 6000; hours Mon–Sat 6:30am–9:00pm, Sun 6:30am–12:00nn; phone 0933 816 9412; facebook.com/couragedfitnesshub.
- Real coaches: Coach Art (Head Coach), Coach Karl, Coach Wilmer. Photos and specialties: **placeholder**.
- Amenities (real): parking, free Wi-Fi, air-conditioning, free water, free locker and shower.
- **Placeholder, must be labelled:** membership prices, coach specialties, about-us copy, year opened, member count. Never present these as fact.

## Product Principles
1. Glanceable first: staff read status in under a second.
2. The demo never dead-ends: every camera/network path has a fallback.
3. Real gym material over generic chrome.
4. Placeholders are visible as placeholders, so nothing invented reaches the client as fact.

## Accessibility & Inclusion
Status is never color-only (badge text + icon). Large touch targets on phone views. Respect reduced motion.
