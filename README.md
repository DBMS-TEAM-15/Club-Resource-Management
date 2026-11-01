# Campus Club Resource Exchange and Intelligent Allocation System

**Team No:** 15  
**SRNs:** PES2UG24CS191 & PES2UG24CS215

## Overview
A web-based platform designed to facilitate efficient sharing and management of resources among college clubs. The system allows clubs to register resources (cameras, projectors, microphones, equipment, spaces, and other event-related assets), making them available for inter-club requests and reservations, conflict detection, alternative resource suggestions, and utilization analytics.

## Tech Stack
- **Frontend & API Layer:** Next.js (App Router, TypeScript)
- **Relational Database (SQL):** PostgreSQL (Users, Clubs, Roles, Resources, Requests, Allocations, Notifications, Transactions)
- **Document Database (NoSQL):** MongoDB (Flexible resource-specific specifications, maintenance logs, usage metadata)

## Project Structure
```text
├── database/               # SQL DDL, migrations, seeds, and MongoDB schema scripts
├── docs/                   # ER diagrams, relational schema, and project documentation
├── src/
│   ├── app/                # Next.js App Router pages and API route handlers
│   │   └── api/            # Backend API endpoints
│   ├── components/         # Reusable UI components
│   ├── lib/
│   │   └── db/             # PostgreSQL and MongoDB connection clients
│   └── types/              # Shared TypeScript interfaces
├── .env.example            # Environment variable template
└── package.json
```

## Getting Started
1. Copy `.env.example` to `.env.local` and configure your PostgreSQL and MongoDB credentials:
   ```bash
   cp .env.example .env.local
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

