# Timesheet App

A modern timesheet tracking application built with Next.js, TypeScript, and PostgreSQL. Track your work hours and manage line items with ease using OAuth authentication and a responsive UI.

## 📋 Features

- **Authentication**: OAuth2 integration with Google and GitHub via NextAuth.js
- **Timesheet Management**: Create, view, and manage timesheets
- **Line Items**: Add detailed work entries with date, duration, and description
- **Responsive Design**: Dark-themed UI with Tailwind CSS
- **Type-Safe**: Full TypeScript support with Prisma ORM
- **Database**: PostgreSQL with Prisma migrations
- **API Routes**: RESTful API endpoints for timesheet operations

## 🏗️ Tech Stack

- **Frontend**: Next.js 16.0.4 with React 19
- **Database**: PostgreSQL with Prisma ORM 7
- **Authentication**: NextAuth.js 4.24 with Google & GitHub providers
- **Styling**: Tailwind CSS 4 with dark mode
- **Language**: TypeScript 5
- **Testing**: Vitest with React Testing Library
- **Linting**: ESLint 9

## 📦 Project Structure

```
├── src/                      # All application source code 
│   ├── app/                  # Next.js App Router 
│   │   ├── api/              # API endpoints 
│   │   │   ├── auth/         # NextAuth configuration 
│   │   │   └── timesheets/   # Timesheet API endpoints 
│   │   ├── layout.tsx        # Root layout 
│   │   ├── page.tsx          # Home page 
│   │   └── globals.css       # Global styles 
│   ├── components/           # Reusable React components
│   │   ├── TimesheetForm.tsx # Form for creating timesheets 
│   │   ├── TimesheetList.tsx # List of saved timesheets
│   │   └── NextAuthProvider.tsx # Auth provider wrapper 
│   ├── lib/                  # External integrations and singletons 
│   │   ├── auth.ts           # NextAuth configuration 
│   │   └── prisma.ts         # Prisma client singleton 
│   ├── prisma/               # Database schema and migrations 
│   │   ├── schema.prisma     # Database schema 
│   │   └── migrations/       # Prisma migrations 
│   ├── utils/                # Pure helper functions 
│   │   ├── math.ts           # Totals calculations (minutes → hours, cost) 
│   │   ├── format.ts         # Formatting helpers (currency, dates) 
│   │   └── index.ts          # Re-exports 
│   └── __tests__/            # Vitest + Testing Library tests 
│       ├── TimesheetForm.test.tsx 
│       └── utils.test.ts     # Example utility tests 
└── public/                   # Static assets
```

## 📊 Database Schema

### User Model
- `id` (UUID): Primary key
- `email` (String, unique): User email
- `name` (String): Display name
- `image` (String): Profile image URL
- `createdAt` (DateTime): Account creation timestamp
- Relations: `timesheets`, `accounts`, `sessions`

### Timesheet Model
- `id` (Int, auto-increment): Primary key
- `userId` (String): Foreign key to User
- `rate` (Float): Hourly rate
- `createdAt` (DateTime): Creation timestamp
- Relations: `user`, `lineItems`

### LineItem Model
- `id` (Int, auto-increment): Primary key
- `timesheetId` (Int): Foreign key to Timesheet
- `date` (DateTime): Work date
- `minutes` (Int): Duration in minutes
- `description` (String): Work description
- Relations: `timesheet`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- PostgreSQL 12+ database
- pnpm (recommended) or npm/yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd timesheet
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the project root with:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/timesheet_db"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-generate-with-openssl-rand-base64-32"

   # OAuth Providers
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_ID="your-github-client-id"
   GITHUB_SECRET="your-github-client-secret"
   ```

4. **Generate NextAuth Secret** (if needed)
   ```bash
   openssl rand -base64 32
   ```

5. **Set up the database**
   ```bash
   pnpm prisma:migrate
   ```

6. **Generate Prisma Client**
   ```bash
   pnpm prisma:generate
   ```

### Development

Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

```bash
pnpm build
pnpm start
```

## 📱 Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm test             # Run tests with Vitest

# Building
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm prisma:migrate   # Create and apply migrations
pnpm prisma:generate  # Generate Prisma Client
pnpm prisma:studio    # Open Prisma Studio (GUI)
pnpm prisma:format    # Format schema.prisma
pnpm prisma:reset:dev # Reset database (dev only!)

# Code Quality
pnpm lint             # Run ESLint
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✓ |
| `NEXTAUTH_URL` | NextAuth callback URL | ✓ |
| `NEXTAUTH_SECRET` | Secret for signing tokens | ✓ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ✓ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | ✓ |
| `GITHUB_ID` | GitHub OAuth app ID | ✓ |
| `GITHUB_SECRET` | GitHub OAuth app secret | ✓ |

## 🔌 API Endpoints

### Timesheets

- **GET** `/api/timesheets` - List all timesheets for authenticated user
- **POST** `/api/timesheets` - Create a new timesheet
- **GET** `/api/timesheets/[id]` - Get a specific timesheet

All endpoints require authentication.

### Request/Response Examples

**Create Timesheet (POST)**
```json
{
  "rate": 50.00,
  "lineItems": [
    {
      "date": "2024-11-24",
      "minutes": 480,
      "description": "Development work"
    }
  ]
}
```

**Response**
```json
{
  "id": 1,
  "userId": "user-uuid",
  "rate": 50.00,
  "createdAt": "2024-11-24T10:00:00Z",
  "lineItems": [
    {
      "id": 1,
      "timesheetId": 1,
      "date": "2024-11-24T00:00:00Z",
      "minutes": 480,
      "description": "Development work"
    }
  ]
}
```

## 🔧 OAuth Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
6. Copy Client ID and Secret to `.env.local`

### GitHub OAuth
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret to `.env.local`

## 🧪 Testing

Run tests with:
```bash
pnpm test
```

Watch mode:
```bash
pnpm test -- --watch
```

## 📝 Database Management

### View Database with Prisma Studio
```bash
pnpm prisma:studio
```

### Create a New Migration
```bash
pnpm prisma:migrate
```

### Reset Database (Development Only)
```bash
pnpm prisma:reset:dev
```

### Format Schema
```bash
pnpm prisma:format
```

## 🚨 Troubleshooting

### DATABASE_URL not set
Make sure `.env.local` exists and contains a valid PostgreSQL connection string.

### Prisma Client not found
Run `pnpm prisma:generate` to regenerate the Prisma Client.

### OAuth callback errors
Verify that your OAuth redirect URIs are correctly configured and match your `NEXTAUTH_URL`.

### Build fails with "Cannot read properties of undefined"
Ensure all environment variables are set in `.env.local` before building.

## 📊 Grand Totals (Optional Feature)

While the core requirement is to calculate totals **per timesheet** (sum of line item minutes and cost based on rate), the application can be extended to provide **grand totals across all saved timesheets**. This feature would allow users to see:

- **Aggregate Time**: Sum of minutes/hours across all timesheets
- **Aggregate Cost**: Sum of costs across all timesheets
- **Dashboard View**: A consolidated overview of work history and earnings

This is not part of the core specification but can be implemented as a reporting/dashboard enhancement by aggregating data from the `Timesheet` and `LineItem` models.

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)

<img width="819" height="842" alt="image" src="https://github.com/user-attachments/assets/e36c71a7-d83d-44bc-b29a-37ac92c57881" />


## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

This project is open source and available under the MIT License.





![image](https://martinstack.dev/pixel/?timesheet.md)
