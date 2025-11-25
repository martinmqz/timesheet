# lib/

The `lib/` directory contains external integrations, singletons, and configuration modules. These are foundational pieces that connect the app to external services.

## 📁 Current Modules

| File | Purpose |
|------|---------|
| `auth.ts` | NextAuth.js configuration (providers, callbacks, session strategy) |
| `prisma.ts` | Prisma client singleton for database access |

## 🎯 Conventions

### What Belongs Here
- Database client initialization
- Authentication configuration
- Third-party service clients (e.g., Stripe, SendGrid)
- Singletons that should be shared across the app

### What Does NOT Belong Here
- Pure utility functions → use `utils/`
- React components → use `components/`
- API route handlers → use `app/api/`

### File Structure
```typescript
// lib/serviceName.ts

import { SomeClient } from "some-package";

// Configuration or initialization
const config = {
  apiKey: process.env.SERVICE_API_KEY,
};

// Export singleton instance
export const serviceClient = new SomeClient(config);
```

## 📦 Module Details

### `auth.ts` - NextAuth Configuration

Configures OAuth providers, session strategy, and callbacks:

```typescript
import { authOptions } from "@/src/lib/auth";
import { getServerSession } from "next-auth";

// In API routes or Server Components
const session = await getServerSession(authOptions);
if (session?.user?.id) {
  // User is authenticated
}
```

**Key exports:**
- `authOptions`: NextAuth configuration object

**Environment variables required:**
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `GITHUB_ID`, `GITHUB_SECRET`
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL`

### `prisma.ts` - Database Client

Provides a singleton Prisma client to prevent multiple instances in development:

```typescript
import { prisma } from "@/src/lib/prisma";

// Query the database
const timesheets = await prisma.timesheet.findMany({
  where: { userId: "user-id" },
  include: { lineItems: true },
});
```

**Environment variables required:**
- `DATABASE_URL`: PostgreSQL connection string

## ✅ Adding New Integrations

1. Create `src/lib/serviceName.ts`
2. Initialize the client with environment variables
3. Export the singleton instance
4. Document required environment variables

### Example: Adding a New Service
```typescript
// src/lib/email.ts
import { MailService } from "@sendgrid/mail";

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY!);

export { mailService };
```

Update `.env.example`:
```
SENDGRID_API_KEY=your-api-key
```

## 🔒 Security Notes

- Never commit secrets to the repository
- Use `getRequiredEnv()` from `utils/` for required environment variables
- Validate environment variables at startup when possible

## 📚 Best Practices

- Keep modules focused on a single external service
- Use singleton pattern to prevent multiple client instances
- Document all required environment variables
- Export typed clients for better IDE support
- Handle initialization errors gracefully
