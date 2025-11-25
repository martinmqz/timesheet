# components/

The `components/` directory contains reusable React components used across the application. Components here are UI building blocks that can be composed into pages.

## 📁 Current Components

| Component | Purpose | Client/Server |
|-----------|---------|---------------|
| `TimesheetForm.tsx` | Form for creating timesheets with line items | Client |
| `NextAuthProvider.tsx` | Wraps app in NextAuth SessionProvider | Client |
| `OAuthForm.tsx` | OAuth sign-in buttons (Google, GitHub) | Client |

## 🎯 Conventions

### File Naming
- **PascalCase** for component files: `TimesheetForm.tsx`, `LineItemRow.tsx`
- One component per file (with related sub-components allowed)
- Export component as `default` or named export matching filename

### Component Structure
```tsx
"use client"; // Only if needed

import { useState } from "react";
import { someUtil } from "@/src/utils/someUtil";

// Props interface - always define explicitly
interface MyComponentProps {
  title: string;
  items: Item[];
  onSubmit?: (data: FormData) => void;
}

// Component with descriptive JSDoc
/**
 * MyComponent - Brief description of what it does.
 * @param title - Display title
 * @param items - List of items to render
 * @param onSubmit - Optional callback when form submits
 */
export default function MyComponent({ title, items, onSubmit }: MyComponentProps) {
  const [state, setState] = useState<string>("");

  return (
    <div className="...">
      {/* Component markup */}
    </div>
  );
}
```

### Props Guidelines
- Define explicit `interface` for props (not inline types)
- Use optional (`?`) for callbacks and non-required props
- Document complex props with JSDoc comments
- Prefer primitive types; avoid `any`

### Client vs Server Components
- Add `"use client"` only when required (hooks, event handlers, browser APIs)
- Server Components cannot use `useState`, `useEffect`, or event handlers
- When a component needs client features, mark it as client component

## ✅ Adding New Components

1. Create `src/components/ComponentName.tsx`
2. Define props interface at the top
3. Export the component
4. Add corresponding test in `src/__tests__/ComponentName.test.tsx`

### Example: New Component
```tsx
// src/components/LineItemCard.tsx
"use client";

import { formatCurrency } from "@/src/utils/format";

interface LineItemCardProps {
  date: string;
  minutes: number;
  description: string;
  rate: number;
}

/**
 * LineItemCard - Displays a single line item with calculated cost.
 */
export default function LineItemCard({ 
  date, 
  minutes, 
  description, 
  rate 
}: LineItemCardProps) {
  const cost = (minutes / 60) * rate;

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <p className="text-sm text-gray-400">{date}</p>
      <p className="text-gray-100">{description}</p>
      <p className="text-indigo-400">{formatCurrency(cost)}</p>
    </div>
  );
}
```

## 🧪 Testing Components

Components should have corresponding tests in `__tests__/`:

```tsx
// src/__tests__/LineItemCard.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LineItemCard from "../components/LineItemCard";

describe("LineItemCard", () => {
  it("renders line item details", () => {
    render(
      <LineItemCard
        date="2025-01-15"
        minutes={60}
        description="Development work"
        rate={100}
      />
    );

    expect(screen.getByText("Development work")).toBeInTheDocument();
    expect(screen.getByText("$100.00")).toBeInTheDocument();
  });
});
```

Run tests:
```bash
pnpm test                           # All tests
pnpm test ComponentName.test.tsx    # Specific component
```

## 🎨 Styling

- Use Tailwind CSS utility classes
- Follow the dark theme color palette:
  - Background: `bg-gray-900`, `bg-gray-800`
  - Text: `text-gray-100`, `text-gray-400`
  - Accent: `text-indigo-400`, `bg-indigo-600`
  - Borders: `border-gray-700`

## 📚 Best Practices

- Keep components focused and single-purpose
- Extract repeated markup into sub-components
- Lift state up when multiple components need the same data
- Use callbacks (`onSubmit`, `onChange`) for parent-child communication
- Avoid business logic in components; delegate to `utils/`
