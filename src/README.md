# src/

The `src/` directory contains all application source code for the Timesheet application. This is the root of the codebase following Next.js App Router conventions.

## 📁 Folder Structure

| Folder | Purpose |
|--------|---------|
| `app/` | Next.js App Router pages, layouts, and API routes |
| `components/` | Reusable React components |
| `lib/` | External integrations and singletons (Prisma, NextAuth) |
| `prisma/` | Database schema and migrations |
| `utils/` | Pure helper functions (calculations, formatting) |
| `__tests__/` | Vitest + Testing Library test files |

## 🎯 Conventions

### File Naming
- **Components**: PascalCase (e.g., `TimesheetForm.tsx`)
- **Utilities**: camelCase (e.g., `timesheet.ts`, `getRequiredEnv.ts`)
- **Tests**: `*.test.ts` or `*.test.tsx` suffix

### SSR/CSR Boundaries
- Server Components are the default in the `app/` directory
- Add `"use client"` directive at the top of files requiring client-side interactivity
- Keep client components minimal; push logic to server where possible

### Import Aliases
Use the `@/src/` alias for absolute imports:
```typescript
import { prisma } from "@/src/lib/prisma";
import { calculateTotals } from "@/src/utils/timesheet";
import TimesheetForm from "@/src/components/TimesheetForm";
```

## 🧪 Testing Strategy

- **Unit tests**: Pure functions in `utils/` (e.g., `calculateTotals`)
- **Component tests**: React components using Testing Library
- **Location**: All tests live in `__tests__/` directory

Run tests:
```bash
pnpm test           # Run all tests
pnpm test --watch   # Watch mode
```

## 🚀 Quick Start

1. Install dependencies: `pnpm install`
2. Set up environment variables (see `.env.example`)
3. Run migrations: `pnpm prisma:migrate`
4. Start dev server: `pnpm dev`

## 📚 Further Reading

- See individual folder READMEs for specific conventions
- Check the root `README.md` for full project documentation
