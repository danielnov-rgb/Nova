# Design & Code Patterns

Reusable patterns, component conventions, and implementation approaches.

---

## Animated Section Entry (IntersectionObserver)
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Used across reports and proposal -->

Standard pattern for scroll-triggered animations:
```tsx
const ref = useRef<HTMLDivElement>(null);
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => { if (entries[0]?.isIntersecting) setIsVisible(true); },
    { threshold: 0.1 }
  );
  if (ref.current) observer.observe(ref.current);
  return () => observer.disconnect();
}, []);
```
Apply: `opacity-0 translate-y-8` -> `opacity-100 translate-y-0` with `transition-all duration-700`.
Stagger with `transitionDelay` prop.

---

## Glassmorphism Navigation
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Used in report nav and proposal nav -->

```
bg-gray-950/80 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50
```
In light mode, override to `rgba(255,255,255,0.95)` via CSS.

---

## Card Styling
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Standard across all Nova UI -->

```
bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all
```
For gradient hover effect, add absolute overlay with `from-primary-500/0 to-cyan-500/0 group-hover:from-primary-500/5`.

---

## Gradient Text
<!-- Added: 2026-02-17 by Daniel -->

```
bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent
```

---

## Section Divider
<!-- Added: 2026-02-17 by Daniel -->

```
h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent
```

---

## Feature-Based Folder Structure
<!-- Added: 2026-02-17 by Daniel -->

Each route/feature owns its code:
```
app/feature/
├── page.tsx
├── layout.tsx
├── _components/    # Feature-specific components
│   └── index.ts    # Barrel exports
├── _data/          # Static data / content
└── _lib/           # Utilities, API helpers
```
Prefix with `_` to exclude from Next.js routing.

---

## API Client Pattern (Frontend)
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Used across admin and voter interfaces -->

All API calls go through a typed `apiRequest<T>` function in `_lib/api.ts`:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });
  if (!res.ok) throw new ApiError(res.status, await res.json());
  return res.json();
}
```

API clients are organized as objects with methods:
- Admin: `authApi`, `sessionsApi`, `problemsApi`, `votersApi`, `voterGroupsApi`, `teamCodesApi`, `sprintsApi`, `onboardingApi`, `audienceApi`, `marketApi`, `competitorsApi`, `projectsApi`, `featuresApi`, `pluginApi`, `solutionsApi`, `problemGroupsApi`, `linksApi`
- Voter: `voterAuthApi`, `voterSessionsApi`, `publicSessionApi`

---

## Auth Storage Pattern
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Unified admin/voter auth in localStorage -->

```typescript
const TOKEN_KEY = "nova_admin_token";
const USER_KEY = "nova_admin_user";

const getToken = () => localStorage.getItem(TOKEN_KEY);
const getUser = () => JSON.parse(localStorage.getItem(USER_KEY) || "null");
const setAuth = (token, user) => { localStorage.setItem(TOKEN_KEY, token); localStorage.setItem(USER_KEY, JSON.stringify(user)); };
const clearAuth = () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); };
const isAuthenticated = () => !!getToken();
```

Same keys used for both admin and voter (unified session).

---

## Role-Based Access Control Pattern
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Permission functions in admin _lib -->

```typescript
canManageProblems(user)       // FDE or ADMIN
canManageSessions(user)       // FDE or ADMIN
canAccessAdminSessions(user)  // FDE or (ADMIN && !isDemoMode)
shouldUseVoterInterface(user) // MEMBER, VOTER, or (ADMIN && isDemoMode)
isReadOnly(user)              // MEMBER or VOTER
canComment(user)              // All authenticated
canFavorite(user)             // All authenticated
```

---

## Demo Mode Error Handling
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Demo mode blocks mutations with specific error shape -->

API returns: `{ statusCode: 403, demoMode: true, message, contactTeam: [...] }`

Frontend checks: `isDemoModeError(error)` and shows popup to contact product team.

---

## Credit Validation Pattern (Voting)
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Voting credit system in API -->

Votes are upsertable. Credit check accounts for existing allocation:
```
netCreditsNeeded = newCredits - existingCreditsOnProblem
allow if netCreditsNeeded <= creditsRemaining
```

Credit hierarchy: Session group override > Group default > Session default.

---

## Nova Plugin Integration Pattern
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: @nova/plugin React integration -->

```tsx
import { NovaProvider, NovaFeature, useNova } from '@nova/plugin/react';

// Wrap app
<NovaProvider apiKey={key} apiEndpoint={url}>
  <App />
</NovaProvider>

// Track features automatically
<NovaFeature featureId="checkout-form" trackOnVisible>
  <CheckoutForm />
</NovaFeature>

// Manual tracking
const nova = useNova();
nova.trackInteract('checkout-form', 'submit', { total: 99 });
nova.trackComplete('checkout-form', { success: true });
```

Events batched (10 events or 5s interval), auto-flush on visibility change.

---

## NestJS Controller Pattern
<!-- Added: 2026-02-17 by Daniel -->
<!-- Context: Standard NestJS patterns used across API -->

```typescript
@Controller('api/resource')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResourceController {
  constructor(private service: ResourceService) {}

  @Post()
  @Roles(UserRole.FDE, UserRole.ADMIN)
  create(@Request() req, @Body() dto: CreateDto) {
    return this.service.create(req.user.tenantId, dto);
  }
}
```

Key decorators: `@UseGuards()`, `@Roles()`, `@Request()`, `@Param()`, `@Body()`, `@Query()`
Validation: class-validator decorators (`@IsString()`, `@IsEmail()`, etc.) auto-validated by global pipe.
Errors: NestJS exceptions (`NotFoundException`, `BadRequestException`, etc.) auto-mapped to HTTP status.
