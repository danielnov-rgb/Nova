# Nova Web (@nova/web)

Next.js 16 frontend application. Port 3000.

## Route Structure

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard: problems, sessions, analytics, settings |
| `/voter` | Voter-facing voting interface |
| `/vote` | Public voting pages |
| `/astrolytics` | Analytics dashboard with light theme (`.astro-light`) |
| `/proposal` | FDE proposal (has its own ThemeProvider) |
| `/proposal-summary` | Print-friendly proposal summary |
| `/reports/together-poc` | Together POC report (multi-page) |
| `/research-intel` | Research intelligence tools |
| `/join` | Session join flow |
| `/(sales)` | Marketing/sales pages |

## Component Organization

- `app/_components/shared/` - Truly shared components (NovaAdCard, NovaLogo, SplashScreen)
- Each route has `_components/`, `_data/`, `_lib/` subdirectories
- Barrel exports via `index.ts` in `_components/`

## Theme System

- Dark theme is default (`bg-gray-950 text-gray-100`)
- Light themes are scoped CSS class overrides in `globals.css`:
  - `.astro-light` - Astrolytics dashboard
  - `.proposal-light` - Proposal pages
- Use `ThemeProvider` + `useTheme()` hook within each themed section
- `.preserve-dark` class keeps elements dark in light mode (ad cards)

## Database Models (Key Fields)

- `Problem`: uses `evidenceItems` (Json[]), `evidenceSummary` (String)
- `VotingSession`: `defaultCredits` is top-level, `config` only has `creditsByRole` and `requiredFields`

## Session Creation Flow

- `problemsApi.list()` fetches problems from DB
- URL param pre-selection: `?problemIds=id1,id2,id3`
- Components in `app/admin/sessions/new/_components/`

## NovaAdCard Guidelines

- Placed after main content, before footer
- Structure: page break, "Advertisement" badge, "Powered by Nova" intro, card
- Styling: `border-2 border-primary-500`, animated glow, dark theme
- Voter pages: footer section with "Powered by" text
