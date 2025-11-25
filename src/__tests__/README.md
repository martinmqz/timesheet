# __tests__/

The `__tests__/` directory contains all test files for the application. Tests are written using Vitest and React Testing Library.

## 📁 Structure

```
__tests__/
├── TimesheetForm.test.tsx   # Component tests
└── timesheets.test.ts       # Utility function tests
```

## 🎯 Conventions

### File Naming
- Test files mirror source files: `ComponentName.test.tsx`, `utilName.test.ts`
- Use `.test.tsx` for React component tests
- Use `.test.ts` for pure function/utility tests

### Test Structure
```typescript
import { describe, it, expect } from "vitest";

describe("ModuleName", () => {
  describe("functionName", () => {
    it("describes expected behavior", () => {
      // Arrange
      const input = { /* ... */ };

      // Act
      const result = functionName(input);

      // Assert
      expect(result).toBe(expectedValue);
    });
  });
});
```

### Component Test Structure
```tsx
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ComponentName from "../components/ComponentName";

describe("ComponentName", () => {
  it("renders initial state", () => {
    render(<ComponentName />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });

  it("responds to user interaction", () => {
    render(<ComponentName />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Updated Text")).toBeInTheDocument();
  });
});
```

## 🔧 Commands

```bash
# Run all tests
pnpm test

# Run tests in watch mode (re-run on file changes)
pnpm test -- --watch

# Run specific test file
pnpm test TimesheetForm.test.tsx

# Run tests with coverage report
pnpm test -- --coverage

# Run tests matching a pattern
pnpm test -- -t "calculates totals"
```

## ✅ Adding New Tests

### For Utility Functions
1. Create `src/__tests__/utilName.test.ts`
2. Import the function from `../utils/utilName`
3. Write tests for all cases (happy path, edge cases, errors)

```typescript
// src/__tests__/format.test.ts
import { describe, it, expect } from "vitest";
import { formatCurrency } from "../utils/format";

describe("formatCurrency", () => {
  it("formats positive amounts", () => {
    expect(formatCurrency(100)).toBe("$100.00");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formats decimal amounts", () => {
    expect(formatCurrency(99.99)).toBe("$99.99");
  });
});
```

### For React Components
1. Create `src/__tests__/ComponentName.test.tsx`
2. Import component and testing utilities
3. Test rendering, user interactions, and state changes

```tsx
// src/__tests__/OAuthForm.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import OAuthForm from "../components/OAuthForm";

// Mock next-auth
vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

describe("OAuthForm", () => {
  it("renders OAuth buttons", () => {
    render(<OAuthForm />);
    expect(screen.getByText(/Continue with Google/)).toBeInTheDocument();
    expect(screen.getByText(/Continue with GitHub/)).toBeInTheDocument();
  });

  it("calls signIn when Google button clicked", async () => {
    const { signIn } = await import("next-auth/react");
    render(<OAuthForm />);
    
    fireEvent.click(screen.getByText(/Continue with Google/));
    expect(signIn).toHaveBeenCalledWith("google");
  });
});
```

## 🧪 Testing Patterns

### Testing User Input
```tsx
fireEvent.change(screen.getByLabelText(/Rate/), { target: { value: "50" } });
expect(screen.getByLabelText(/Rate/)).toHaveValue(50);
```

### Testing Async Operations
```tsx
import { waitFor } from "@testing-library/react";

it("loads data", async () => {
  render(<DataComponent />);
  
  await waitFor(() => {
    expect(screen.getByText("Loaded Data")).toBeInTheDocument();
  });
});
```

### Mocking API Calls
```typescript
import { vi } from "vitest";

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: [] }),
  })
) as jest.Mock;
```

### Testing Form Submission
```tsx
it("submits form data", async () => {
  const onSubmit = vi.fn();
  render(<Form onSubmit={onSubmit} />);

  fireEvent.change(screen.getByLabelText(/Name/), { target: { value: "Test" } });
  fireEvent.click(screen.getByRole("button", { name: /Submit/ }));

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({ name: "Test" });
  });
});
```

## 📊 Coverage

Generate coverage report:
```bash
pnpm test -- --coverage
```

Coverage thresholds (recommended):
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

## 📚 Best Practices

- Test behavior, not implementation details
- Use descriptive test names that explain what's being tested
- Follow the Arrange-Act-Assert pattern
- Mock external dependencies (API calls, next-auth)
- Test edge cases and error states
- Keep tests focused and independent
- Use `screen` queries over container queries
- Prefer `getByRole` and `getByLabelText` over `getByTestId`

## 🔗 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
