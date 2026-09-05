# Premium Consulting Firm Website

A cinematic, Hollywood-grade React.js and Node.js website for a premium consulting company featuring unique scroll behaviors, motion blur, camera effects, lens flare, and advanced visual effects.

## 🎬 Director's Vision

This website delivers a Christopher Nolan-esque opening scene experience - intellectually stimulating, visually stunning, and emotionally resonant. Every scroll deepens the conviction that this is the consulting firm you need.

## ✨ Features

### Section 1: Hero - "Cinematic Awakening"
- Multi-layer parallax with cinematic camera effects
- Motion blur proportional to scroll velocity
- Lens flare system with anamorphic streaks and chromatic aberration
- 3D camera dolly push-in with Dutch angle rotation
- Depth of field simulation
- Film grain overlay and vignette breathing
- 9 distinct parallax layers

### Section 2: About - "The Liquid Narrative"
- WebGL fluid simulation reacting to scroll velocity
- Magnetic text that pulls toward viewport center
- Brand colors bleeding like ink in water
- Elastic word stretching effects

### Section 3: Services - "The Geometric Transformer"
- 4D tessellation with morphing polyhedral shapes
- Orbiting service cards in 3D space
- Z-depth color temperature shifts
- SVG connection lines with pulsing strokes

### Section 4: Process - "The Time Warp"
- Horizontal timeline progressing vertically
- Time dilation effects with particle freezing
- 3D fabric-like ribbons connecting phases
- Portal materialization animations

### Section 5: Case Studies - "The Gravity Well"
- Central gravity well pulling elements
- Orbital case study cards
- Scroll speed controlling orbital velocity
- Particle-based metrics charts

### Section 6: Insights - "The Neural Network"
- Growing synaptic connections
- Article cards blooming like petals
- Pulsing energy connections
- Increasing network density

### Section 7: Team - "The Constellation Assembly"
- Starfield forming constellations
- Supernova team member reveals
- Gravitational pull on nearby elements
- Department-based organization

### Section 8: Contact - "The Convergence Event"
- Universal implosion animation
- Big Bang form materialization
- Energy-accumulating submit button
- Sequential field appearance

## 🛠️ Technical Stack

### Frontend
- **React 18+** with TypeScript
- **Next.js 14** App Router
- **GSAP** with ScrollTrigger, ScrollSmoother, MotionPath
- **Lenis** for smooth inertial scrolling
- **Three.js / React Three Fiber** for WebGL
- **Framer Motion** for micro-interactions
- **Tailwind CSS v3**
- **Zustand** for state management

### Backend
- **Node.js 20+** with Express
- **PostgreSQL** with Prisma ORM
- **Redis** caching (optional)
- **Nodemailer** for email

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- PostgreSQL (for backend)

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev

# Run backend (separate terminal)
npm run backend:dev
```

## 📁 Project Structure

```
/workspace
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout with fonts
│   │   └── page.tsx         # Main page component
│   ├── components/          # React components by section
│   ├── hooks/               # Custom React hooks
│   ├── store/               # Zustand stores
│   └── styles/              # Global styles
├── backend/
│   ├── src/                 # Express server
│   └── prisma/              # Database schema
└── public/                  # Static assets
```

## ⚡ Performance

- Lighthouse 95+ target
- 60fps on mid-tier devices
- Initial load under 100KB JavaScript
- AVIF/WebP image formats
- Full code splitting

## 🔒 Non-Negotiable Constraints

1. No scroll jacking - User always feels in control
2. No performance degradation - Smoothness is sacred
3. No accessibility shortcuts - Beauty must be usable
4. No generic templates - Everything custom-crafted
5. No sacrificing clarity - Message always comes through

---

*Crafted with ❤️ for visionaries*
