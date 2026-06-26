# Nexus EMS

Modern workforce platform — employees, departments, leave workflows, and customer support — built with Spring Boot and Next.js.

| Layer    | Stack                          |
|----------|--------------------------------|
| Backend  | Spring Boot 3, Java 17, JPA    |
| Frontend | Next.js 15, React 19, Tailwind |
| Database | PostgreSQL 16 (Docker)       |

## Prerequisites

- Java 17+
- Node.js 20+
- Docker & Docker Compose

## Quick start

### 1. Start PostgreSQL

```bash
cp .env.example .env   # optional — defaults work for local dev
docker compose up -d
```

### 2. Run the backend

```bash
cd backend
./mvnw spring-boot:run
```

API: [http://localhost:8080](http://localhost:8080)

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

## Demo accounts

| Role     | Username   | Password      |
|----------|------------|---------------|
| Admin    | `admin`    | `admin123`    |
| Employee | `alice`    | `employee123` |
| Customer | `customer` | `customer123` |

Use the **Quick demo login** buttons on the sign-in page to auto-fill credentials.

## Build for production

```bash
cd backend && ./mvnw package -DskipTests
cd frontend && npm install && npm run build && npm start
```

## Environment variables

| Variable           | Default                                      |
|--------------------|----------------------------------------------|
| `DATABASE_URL`     | `jdbc:postgresql://localhost:5434/authdb`    |
| `DATABASE_USER`    | `auth`                                       |
| `DATABASE_PASSWORD`| `auth`                                       |
| `JPA_DDL_AUTO`     | `update`                                     |

## Stop services

```bash
docker compose down        # keep data volume
docker compose down -v     # remove data volume (re-seeds on next run)
```

## Free deployment (Render + Vercel + Neon)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Paul-dir/auth-project)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FPaul-dir%2Fauth-project&project-name=nexus-ems&root-directory=frontend)

Follow in order:

### Step 1 — Neon (free PostgreSQL)

1. Sign up at [neon.tech](https://neon.tech) → **New project**.
2. Open **Connection details** → choose **JDBC**.
3. Copy three values for Render:
   - `DATABASE_URL` — full JDBC string, e.g. `jdbc:postgresql://ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
   - `DATABASE_USER` — e.g. `neondb_owner`
   - `DATABASE_PASSWORD` — from Neon dashboard

### Step 2 — Render (free backend)

1. Click **Deploy to Render** above (or [render.com/deploy](https://render.com/deploy?repo=https://github.com/Paul-dir/auth-project)).
2. Connect GitHub → approve access to `Paul-dir/auth-project`.
3. When prompted for env vars, paste Neon credentials and set:
   - `CORS_ALLOWED_ORIGINS` — use `http://localhost:3000` for now (update after Vercel in step 4)
4. Wait for deploy (~5–10 min first build). Note your API URL, e.g. `https://nexus-ems-api.onrender.com`.

### Step 3 — Vercel (free frontend)

1. Click **Deploy with Vercel** above.
2. Set **Root Directory** to `frontend` if not auto-detected.
3. Add environment variable:
   - `BACKEND_URL` = your Render URL from step 2 (no trailing slash)
4. Deploy → note your live URL, e.g. `https://nexus-ems.vercel.app`.

### Step 4 — Link frontend ↔ backend

1. In Render → **nexus-ems-api** → **Environment** → set `CORS_ALLOWED_ORIGINS` to your Vercel URL.
2. Render redeploys automatically. First API request after idle may take ~30s (free tier cold start).

Demo accounts (`admin` / `admin123`, etc.) are seeded on first backend startup.
