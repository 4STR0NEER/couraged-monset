# Graph Report - couraged  (2026-10-08)

## Corpus Check
- Corpus is ~44,968 words - fits in a single context window. You may not need a graph.

## Summary
- 209 nodes · 404 edges · 14 communities (12 shown, 2 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.87)
- Token cost: 345,917 input · 0 output

## Community Hubs (Navigation)
- App Shell & Demo Chrome
- Public Home Page
- Build Tooling
- Product Brief & Brand
- Admin Dashboard Charts
- Mock Data & App State
- Runtime Dependencies
- Free Weights Photo
- Cardio Deck Photo
- Smith Machine Photo
- Training Photo
- Logo & Brand Mark
- Vercel Routing

## God Nodes (most connected - your core abstractions)
1. `Member()` - 14 edges
2. `Overview()` - 12 edges
3. `useApp()` - 12 edges
4. `statusOf()` - 11 edges
5. `Home()` - 11 edges
6. `react` - 10 edges
7. `startOfDay()` - 10 edges
8. `AppProvider()` - 10 edges
9. `motion` - 9 edges
10. `App()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `AdminDemo()` --calls--> `logEntry()`  [EXTRACTED]
  src/pages/admin/Admin.jsx → src/state.jsx
- `couraged-monset README` --references--> `Gym Membership System Prototype`  [INFERRED]
  README.md → PRODUCT.md
- `index.html App Shell` --references--> `Client Brand Palette (#FEBE10 gold, #BA0021 crimson, #19171B ink)`  [INFERRED]
  index.html → PRODUCT.md
- `index.html App Shell` --references--> `Gym Photos (public/assets/gym-*.jpg)`  [INFERRED]
  index.html → PRODUCT.md
- `App()` --calls--> `Home()`  [EXTRACTED]
  src/App.jsx → src/pages/Home.jsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Prototype feature surfaces (QR check-in, member portal, admin dashboard, home page)** — product_qr_check_in, product_member_portal, product_admin_dashboard, product_public_home_page [EXTRACTED 1.00]
- **CourageD product principles** — product_glanceable_first, product_demo_never_dead_ends, product_real_gym_material, product_placeholder_labelling [EXTRACTED 1.00]
- **Free Weights Zone Setup** — public_assets_gym_dumbbells_dumbbell_rack, public_assets_gym_dumbbells_adjustable_bench, public_assets_gym_dumbbells_mirrored_wall, public_assets_gym_dumbbells_artificial_turf_floor [INFERRED 0.85]
- **Smith Machine Strength Training Station** — public_assets_gym_smith_smith_machine, public_assets_gym_smith_barbell_squat_pad, public_assets_gym_smith_weight_plate_storage [EXTRACTED 1.00]
- **CourageD Brand Identity** — public_assets_logo_couraged_wordmark, public_assets_logo_fitness_couple_illustration, public_assets_logo_brand_palette, public_assets_logo_couraged_fitness_brand [INFERRED 0.85]

## Communities (14 total, 2 thin omitted)

### Community 0 - "App Shell & Demo Chrome"
Cohesion: 0.13
Nodes (34): animejs, lucide-react, motion, react, App(), ROLES, RoleSwitcher(), Stub() (+26 more)

### Community 1 - "Public Home Page"
Cohesion: 0.13
Nodes (29): SlideTextButton(), VARIANTS, AMENITIES, COACHES, GYM, MEMBER_PLANS, openStatus(), peso() (+21 more)

### Community 2 - "Build Tooling"
Cohesion: 0.08
Nodes (27): devDependencies, tailwindcss, @tailwindcss/vite, vite, @vitejs/plugin-basic-ssl, @vitejs/plugin-react, name, private (+19 more)

### Community 3 - "Product Brief & Brand"
Cohesion: 0.10
Nodes (17): index.html App Shell, manifest.webmanifest link, Admin Dashboard, Client Brand Palette (#FEBE10 gold, #BA0021 crimson, #19171B ink), Coaches (Coach Art, Coach Karl, Coach Wilmer), CourageD Fitness Hub, Gym Membership System Prototype, Gym Photos (public/assets/gym-*.jpg) (+9 more)

### Community 4 - "Admin Dashboard Charts"
Cohesion: 0.18
Nodes (19): CountUp(), fmtDate(), axis, BusiestDays(), C, CategoryChart(), DailyChart(), DOW_IDX (+11 more)

### Community 5 - "Mock Data & App State"
Cohesion: 0.14
Nodes (15): DOW_F, EXPENSE_CATEGORIES, FIRST_F, FIRST_M, generate(), HOUR_W, LAST, mulberry32() (+7 more)

### Community 6 - "Runtime Dependencies"
Cohesion: 0.17
Nodes (12): dependencies, animejs, @fontsource/barlow, @fontsource-variable/big-shoulders-display, lucide-react, motion, qr-scanner, qrcode.react (+4 more)

### Community 7 - "Free Weights Photo"
Cohesion: 0.25
Nodes (8): Adjustable Weight Bench, Artificial Turf Floor, Dumbbell Rack, Gym Dumbbells Photo, Mirrored Wall, Motivational Wall Signage, Orange Accent Trim, Strength Training Area

### Community 8 - "Cardio Deck Photo"
Cohesion: 0.50
Nodes (5): Gym Cardio Zone Photo, CouRageD Gym Facility, CouRageD Logo Watermark, Curved Manual Treadmill, Spinning Bike (yellow/black indoor cycle)

### Community 9 - "Smith Machine Photo"
Cohesion: 0.40
Nodes (5): Barbell with Squat Pad, Gym Facility Interior, Gym Smith Machine Photo, Smith Machine, Weight Plate Storage

### Community 10 - "Training Photo"
Cohesion: 0.50
Nodes (5): Gym Training Photo, EZ Bar Curl Exercise, CouRageD Logo Watermark, Free Weights Area (Fixed Barbell Rack, Plate-Loaded Machines), Strength Training

### Community 11 - "Logo & Brand Mark"
Cohesion: 0.40
Nodes (5): CourageD Logo (logo.jpg), CourageD Brand Palette (black, gold, red, white), CourageD Fitness Brand, CourageD Wordmark, Fitness Couple Illustration

## Knowledge Gaps
- **76 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+71 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 85 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `index.html App Shell` connect `Product Brief & Brand` to `Build Tooling`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _76 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Shell & Demo Chrome` be split into smaller, more focused modules?**
  _Cohesion score 0.1254355400696864 - nodes in this community are weakly interconnected._
- **Why does `react` connect `App Shell & Demo Chrome` to `Public Home Page`, `Build Tooling`, `Admin Dashboard Charts`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **Should `Public Home Page` be split into smaller, more focused modules?**
  _Cohesion score 0.12701612903225806 - nodes in this community are weakly interconnected._
- **Should `Build Tooling` be split into smaller, more focused modules?**
  _Cohesion score 0.07526881720430108 - nodes in this community are weakly interconnected._
- **Should `Product Brief & Brand` be split into smaller, more focused modules?**
  _Cohesion score 0.09881422924901186 - nodes in this community are weakly interconnected._