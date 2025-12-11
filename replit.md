# CulturaMeet - Cultural Festival Management Platform

## Overview

CulturaMeet is a full-stack Next.js 14 application for managing cultural festivals. It provides live scoreboards, team management, jury portals, program registration, and real-time result tracking. The platform features a modern dark-themed UI with gradient accents (indigo/purple) and serves multiple user types: public visitors viewing results, admin staff managing the festival, jury members scoring events, and team leaders managing their participants.

## Recent Changes (December 2025)
- Rebranded from "Funoon Fiesta" to "CulturaMeet"
- Generated new logo/favicon with CM monogram design
- Redesigned homepage with modern dark gradient theme
- Removed old Malayalam text imagery
- Updated all component references, manifest, and metadata

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

- **Framework**: Next.js 14 with App Router and Server Actions
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS v4 with custom theme variables and shadcn/ui components
- **State Management**: React hooks with server-side data fetching; client components use local state
- **Real-time Updates**: Pusher.js for live data synchronization across all connected clients
- **Animations**: Framer Motion for UI transitions and interactions
- **Charts**: Recharts for data visualization (scoreboards, participant stats)

### Backend Architecture

- **API Layer**: Next.js API routes and Server Actions for data mutations
- **Authentication**: Cookie-based session management with three separate portals:
  - Admin portal (`/admin/*`) - Full system access
  - Jury portal (`/jury/*`) - Program scoring and result submission
  - Team portal (`/team/*`) - Student registration and program enrollment
- **Middleware**: Route protection via Next.js middleware checking cookie tokens
- **AI Integration**: Google Gemini API for festival chatbot assistant

### Data Storage

- **Database**: MongoDB via Mongoose ODM
- **Connection**: Local MongoDB instance by default (`mongodb://127.0.0.1:27017/fest_app`)
- **Schema Design**: Separate models for Teams, Students, Programs, Results (pending/approved), Assignments, Registrations, and Notifications
- **Data Seeding**: Automatic database seeding with default teams, programs, and sample data on first run

### Key Design Patterns

1. **Server Components by Default**: Data fetching happens on the server; client components handle interactivity
2. **Real-time Wrapper Components**: Pages wrap content in realtime components that listen for Pusher events and trigger router.refresh()
3. **Form Actions**: Server Actions handle form submissions with toast notifications for feedback
4. **Progressive Web App**: Full PWA support with service worker, offline fallback, and install prompts

### Portal Structure

- **Public Pages**: Homepage with live scores, results grid, scoreboard, participant lookup with QR scanning
- **Admin Portal**: Manage teams, students, programs, jury assignments, approve/reject results
- **Jury Portal**: View assigned programs, submit scores and grades for participants
- **Team Portal**: Register students, enroll in programs, request participant replacements

## External Dependencies

### Third-Party Services

- **Pusher**: Real-time WebSocket communication for live updates (requires `PUSHER_APP_ID`, `PUSHER_SECRET`, `NEXT_PUBLIC_PUSHER_KEY`, `NEXT_PUBLIC_PUSHER_CLUSTER`)
- **Google Gemini AI**: Powers the festival chatbot (requires `GEMINI_API_KEY`)
- **Vercel Speed Insights**: Performance monitoring (optional)

### Database

- **MongoDB**: Primary data store - requires local MongoDB instance or remote connection via `MONGODB_URI`

### Key NPM Packages

- `mongoose`: MongoDB ODM for schema definition and queries
- `pusher` / `pusher-js`: Server and client real-time messaging
- `@google/generative-ai`: Gemini AI integration
- `next-pwa`: Progressive Web App functionality
- `qrcode` / `@yudiel/react-qr-scanner`: QR code generation and scanning for participant lookup
- `jspdf`: PDF generation for reports and replacement requests
- `recharts`: Chart components for scoreboards and statistics
- `framer-motion`: Animation library
- `react-toastify`: Toast notifications