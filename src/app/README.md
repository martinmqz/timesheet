# app/

The `app/` directory contains all Next.js App Router pages, layouts, and API routes. This is where routing and page rendering logic lives.

## 📁 Structure

```
app/
├── layout.tsx          # Root layout (wraps all pages)
├── page.tsx            # Home page (/)
├── globals.css         # Global Tailwind styles
├── (protected)/        # Route group for authenticated pages
│   ├── layout.tsx      # Auth guard layout
│   └── timesheets/     # /timesheets route
│       └── page.tsx
├── api/                # API route handlers
│   ├── auth/           # NextAuth endpoints
│   └── timesheets/     # Timesheet CRUD endpoints
└── auth/               # Auth-related pages
    └── signin/         # /auth/signin page
```

## 🎯 Conventions

### Route Groups
- Use parentheses `(groupName)` for logical grouping without affecting URL
- `(protected)/` contains all routes requiring authentication

### Layouts
- `layout.tsx` files wrap all child routes
- Root layout includes `NextAuthProvider` for session management
- Protected layout checks authentication and redirects if needed

### Server vs Client Components
```tsx
// Server Component (default) - can use async/await, access DB
export default async function Page() {
  const data = await prisma.timesheet.findMany();
  return <div>{/* ... */}</div>;
}

// Client Component - for interactivity, hooks, browser APIs
"use client";
export default function InteractivePage() {
  const [state, setState] = useState();
  return <div>{/* ... */}</div>;
}
```

### API Routes
- Located in `api/` subdirectory
- Use `route.ts` files with HTTP method exports (`GET`, `POST`, etc.)
- Always validate session before processing requests

## ✅ Adding New Pages

1. **Public page**: Create `app/[route]/page.tsx`
2. **Protected page**: Create `app/(protected)/[route]/page.tsx`
3. **API endpoint**: Create `app/api/[route]/route.ts`

### Example: New Protected Page
```tsx
// app/(protected)/reports/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function ReportsPage() {
  // Page automatically protected by (protected)/layout.tsx
  return <h1>Reports</h1>;
}
```

### Example: New API Route
```typescript
// app/api/reports/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Handle request...
  return NextResponse.json({ data: [] });
}
```

## 🔒 Authentication Flow

1. Unauthenticated users visiting `/timesheets` are redirected to `/auth/signin`
2. After OAuth sign-in, users are redirected back to the protected route
3. Session is managed via JWT tokens (configured in `lib/auth.ts`)

## 🎨 Styling

- Global styles in `globals.css`
- Use Tailwind CSS utility classes inline
- Dark theme is enabled by default (`html.dark`)

## 📚 Best Practices

- Keep page components thin; delegate logic to `components/` and `utils/`
- Use Server Components for data fetching when possible
- Validate all API inputs before processing
- Return appropriate HTTP status codes from API routes
