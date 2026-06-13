# Mini Booking Management System

Co-working space booking system — Laravel 13 (Modules pattern) + React/Vite/TypeScript.

## Stack

- **Backend:** Laravel 13, Sanctum SPA cookie auth, MySQL 8 (Docker)
- **Frontend:** React 19, TypeScript (strict), Tailwind CSS v4, react-router v7, Axios, React Hook Form + Zod, Context API

## Prerequisites

- PHP 8.3+, Composer
- Node.js 20+
- Docker + Docker Compose

## Running locally

### 1. Start MySQL

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
composer install
cp .env.example .env
# Edit .env if needed (DB creds default to Docker compose values)
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Backend runs at `http://localhost:8000`.

Demo credentials: `admin@example.com` / `password`

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs at `http://localhost:5173`.

> **Note:** The browser automatically receives the Sanctum CSRF cookie on first login. No manual setup required — Axios is configured with `withCredentials: true` and handles the `X-XSRF-TOKEN` header automatically.

## Running tests

```bash
cd backend
php artisan test
```

Uses SQLite in-memory and `SESSION_DRIVER=array` — no Docker required for tests.

## API endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/login | — | Login (sets session cookie) |
| POST | /api/logout | Session cookie | Logout (invalidates session) |
| GET | /api/user | Session cookie | Current authenticated user |
| GET | /api/rooms | — | List rooms |
| GET | /api/rooms/{id}/bookings | — | List bookings for room |
| POST | /api/bookings | Session cookie | Create booking |
| DELETE | /api/bookings/{id} | Session cookie | Delete booking |

All API responses use a common envelope:

```json
// Success
{ "code": 200, "data": <payload>, "msg": null, "success": true }

// Error
{ "code": 422, "errors": {...}, "error": { "code": 422, "message": "...", "errors": {...}, "key": "..." }, "msg": "...", "success": false }
```

## Design decisions

### Modules pattern
Routes, controllers, services, and repositories live in `app/Modules/Booking/`. A `ModuleRouteServiceProvider` auto-discovers `Routes/api.php` files via glob, keeping module code self-contained.

### Service + Repository
`BookingService` holds business logic (overlap check, transaction). `BookingRepository`/`RoomRepository` abstract Eloquent queries. Controllers only call services — no direct Eloquent in controllers.

### Overlap prevention
`BookingService::create` runs in a DB transaction with `SELECT ... FOR UPDATE` on the room row, serializing concurrent requests for the same room. Overlap condition: `start < :end AND end > :start` — back-to-back bookings (end == next start) are allowed.

### Cookie httpOnly auth (Sanctum SPA)
Auth uses Sanctum stateful session cookies (`httpOnly`, `SameSite=Lax`) instead of Bearer tokens. This prevents XSS from stealing credentials since JavaScript cannot access httpOnly cookies. CSRF protection is handled via the `X-XSRF-TOKEN` header that Axios sends automatically after calling `GET /sanctum/csrf-cookie`. The frontend never stores any auth token — session state is server-side only.

### Common API response envelope
All API responses (success and error) share a consistent shape with `code`, `data`/`errors`, `msg`, and `success` fields. Exceptions (validation, auth, 404, overlap, 500) are handled centrally in `bootstrap/app.php` and rendered through `ApiErrorResponse`, ensuring no HTML error pages leak through `api/*` routes.

### TypeScript + Tailwind v4 + react-router v7
The frontend uses strict TypeScript with a typed service layer that matches the envelope shape. Auth state is managed by `AuthContext` (bootstrapped via `GET /api/user` on mount) and is the single source of truth — no `localStorage`, no token anywhere in the client. Route-based auth boundaries are implemented with `react-router v7` and a `RequireAuth` guard. UI is built with Tailwind CSS v4.

### Context + React Hook Form + Zod
Global state via React Context + `useReducer` (no React Query — keeps dependencies minimal). Forms use React Hook Form with Zod schema validation for client-side rules, plus server error mapping for overlap and 422 responses.
