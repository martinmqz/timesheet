# utils/

The `utils/` directory contains pure helper functions used throughout the application. These are stateless, testable functions with no side effects.

## 📁 Current Utilities

| File | Purpose |
|------|---------|
| `timesheet.ts` | Timesheet calculations (totals, hours, cost) |
| `getRequiredEnv.ts` | Environment variable validation |

## 🎯 Conventions

### What Belongs Here
- Pure functions (same input → same output)
- Calculations and transformations
- Formatting helpers (currency, dates, strings)
- Validation functions
- Type guards

### What Does NOT Belong Here
- Functions with side effects (API calls, database queries)
- React hooks or components
- External service integrations → use `lib/`

### File Structure
```typescript
// utils/featureName.ts

// Export interfaces for function parameters/returns
export interface LineItem {
  minutes: number;
}

// Export pure functions with JSDoc comments
/**
 * Calculates timesheet totals from line items and hourly rate.
 * @param lineItems - Array of line items with minutes
 * @param rate - Hourly rate in dollars
 * @returns Object with totalMinutes, totalHours, totalCost
 */
export function calculateTotals(lineItems: LineItem[], rate: number) {
  const totalMinutes = lineItems.reduce((sum, li) => sum + li.minutes, 0);
  const totalHours = totalMinutes / 60;
  const totalCost = rate * totalHours;

  return { totalMinutes, totalHours, totalCost };
}
```

## 📦 Module Details

### `timesheet.ts` - Timesheet Calculations

```typescript
import { calculateTotals } from "@/src/utils/timesheet";

const lineItems = [{ minutes: 60 }, { minutes: 90 }];
const rate = 50; // $50/hour

const { totalMinutes, totalHours, totalCost } = calculateTotals(lineItems, rate);
// totalMinutes: 150
// totalHours: 2.5
// totalCost: 125
```

### `getRequiredEnv.ts` - Environment Validation

```typescript
import getRequiredEnv from "@/src/utils/getRequiredEnv";

// Throws if GOOGLE_CLIENT_ID is not set
const clientId = getRequiredEnv("GOOGLE_CLIENT_ID");
```

## ✅ Adding New Utilities

1. Create `src/utils/featureName.ts`
2. Export pure functions and interfaces
3. Add corresponding tests in `src/__tests__/featureName.test.ts`

### Example: Format Utilities
```typescript
// src/utils/format.ts

/**
 * Formats a number as USD currency.
 * @param amount - Amount in dollars
 * @returns Formatted string (e.g., "$1,234.56")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Formats minutes as hours and minutes.
 * @param minutes - Total minutes
 * @returns Formatted string (e.g., "2h 30m")
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}
```

### Example: Validation Utilities
```typescript
// src/utils/validation.ts

/**
 * Validates that a rate is a positive number.
 */
export function isValidRate(rate: unknown): rate is number {
  return typeof rate === "number" && rate >= 0 && isFinite(rate);
}

/**
 * Validates line item data.
 */
export function isValidLineItem(item: unknown): item is { minutes: number; description: string } {
  return (
    typeof item === "object" &&
    item !== null &&
    "minutes" in item &&
    typeof (item as any).minutes === "number" &&
    (item as any).minutes >= 0
  );
}
```

## 🧪 Testing Utilities

All utility functions should have comprehensive tests:

```typescript
// src/__tests__/format.test.ts
import { describe, it, expect } from "vitest";
import { formatCurrency, formatDuration } from "../utils/format";

describe("formatCurrency", () => {
  it("formats positive amounts", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });
});

describe("formatDuration", () => {
  it("formats hours and minutes", () => {
    expect(formatDuration(150)).toBe("2h 30m");
  });

  it("formats minutes only", () => {
    expect(formatDuration(45)).toBe("45m");
  });
});
```

Run tests:
```bash
pnpm test                    # All tests
pnpm test utils.test.ts      # Specific file
pnpm test --coverage         # With coverage report
```

## 📚 Best Practices

- Keep functions pure (no side effects)
- Use TypeScript for input/output types
- Add JSDoc comments for public functions
- Write tests for edge cases (zero, negative, empty arrays)
- Export interfaces for complex parameter types
- Group related functions in the same file
- Use descriptive function names (`calculateTotals`, not `calc`)
