# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application for a gas equipment management and quotation system (Sistema de Cotizaciones). It's a PWA with authentication via Clerk.

**Tech Stack:**
- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Clerk authentication
- Radix UI components
- React Hook Form + Zod for validation
- Sonner for toasts
- PWA enabled (next-pwa)

## Architecture

### App Structure

The application uses Next.js App Router with route groups:

```
app/
├── (landing)         # Public landing page group
│   └── page.tsx
├── (auth)           # Authentication pages (Clerk)
│   ├── layout.tsx
│   └── (routes)/
│       ├── sign-in/
│       └── sign-up/
├── (dashboard)      # Protected dashboard area
│   ├── layout.tsx
│   └── (routes)/
│       ├── dashboard/
│       ├── cotizaciones/
│       └── historial/
├── offline/         # Offline page
└── layout.tsx       # Root layout (Clerk provider, global setup)
```

**Key Design Patterns:**
- Route groups `(name)` provide layout and organization without affecting URLs
- Nested `(routes)` group organizes dashboard pages
- Clerk auth is provided at root level
- Each section can have its own layout (e.g., dashboard has a sidebar layout with AppSidebar)

### Component Structure

**UI Components** (`components/ui/`):
- Built with Radix UI primitives
- Styled with Tailwind + CVA (class-variance-authority)
- Standard shadcn-style components (button, card, dialog, etc.)

**Feature Components** (`components/`):
- `landing-navbar.tsx` - Navigation for landing/public pages
- `app-sidebar.tsx` - Dashboard sidebar with navigation
- `cotizacion/` - Quote-related components (forms, tables)
- `cotizacion-pdf.tsx` - PDF export functionality
- `ServiceWorkerRegistration.tsx`, `PwaInstallPrompt.tsx`, `NetworkStatus.tsx` - PWA support

### Styling

- **Tailwind CSS 4** with PostCSS plugin
- **CVA** (class-variance-authority) for component variants
- Dark mode via `next-themes`
- Custom CSS in `globals.css` (20px dotted background pattern in dashboard)

## Common Development Tasks

**Start development:**
```bash
npm run dev
```
Server runs on http://localhost:3000 with Turbopack

**Build for production:**
```bash
npm run build
npm start
```

**Linting:**
```bash
npm run lint          # Standard linting
npm run check         # Strict ESLint check (zero warnings)
```

## Key Implementation Details

### Authentication

- Uses Clerk (@clerk/nextjs)
- `SignInButton`, `UserButton`, `useUser()` hook available in client components
- Root layout wraps everything in `<ClerkProvider>`
- Protected routes in (dashboard) should use Clerk middleware (check if configured in middleware.ts)

### Landing Pages

- Public routes under `(landing)` route group
- Use `LandingNavbar` component for consistent header
- No authentication required
- Example: `app/(landing)/page.tsx` - main landing page

### Dashboard Pages

- Protected routes under `(dashboard)` route group
- Use DashboardLayout which provides:
  - Desktop sidebar (fixed, width: w-64)
  - Mobile sidebar (sheet/drawer)
  - Main content area with padding
- Pages go in `app/(dashboard)/(routes)/[feature]/page.tsx`

### Path Aliases

`@/*` resolves to project root. Examples:
- `@/components/ui/button`
- `@/lib/utils`
- `@/components/landing-navbar`

### Forms

- React Hook Form for form state
- Zod for validation
- Use the `form` component from `components/ui/form`

## Database & Backend

No backend API mentioned in dependencies. If needed, ensure to:
1. Add database library (Prisma, etc.)
2. Create API routes in `app/api/` folder
3. For database schema changes with Prisma, run `npx prisma db push` and inform the user

## Deployment

- App is PWA-enabled with offline support
- Works on Vercel (recommended for Next.js)
- Includes service worker registration and offline page

## Notes for Future Development

- When adding new landing routes, follow the pattern: `app/(landing)/[route]/page.tsx`
- When adding dashboard features, follow: `app/(dashboard)/(routes)/[feature]/page.tsx`
- Use TypeScript strictly (tsconfig.json has `"strict": true`)
- All UI components should use Tailwind + Radix UI patterns for consistency
- For large lists/tables, consider using the existing `ProductoTable` pattern
