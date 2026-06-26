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

1. **Database** — create a free PostgreSQL project at [neon.tech](https://neon.tech) and copy the JDBC connection string (`jdbc:postgresql://…/authdb?sslmode=require`).
2. **Backend** — at [render.com](https://render.com), connect this repo and deploy from `render.yaml`. Set `DATABASE_URL`, `DATABASE_USER`, `DATABASE_PASSWORD`, and `CORS_ALLOWED_ORIGINS` (your Vercel URL, e.g. `https://your-app.vercel.app`).
3. **Frontend** — at [vercel.com](https://vercel.com), import the repo with root directory `frontend`. Set `BACKEND_URL` to your Render API URL (e.g. `https://nexus-ems-api.onrender.com`).

Demo accounts work after the backend starts and seeds data on first run.
