# Auth Project

Full-stack employee management app with JWT authentication, departments, leave requests, and support tickets.

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

Wait until the database is healthy:

```bash
docker compose ps
```

### 2. Run the backend

```bash
cd backend
./mvnw spring-boot:run
```

API: [http://localhost:8080](http://localhost:8080)

Default admin account (seeded on first run): **admin** / **admin123**

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

The frontend proxies `/api/*` to the backend on port 8080.

## Build for production

```bash
# Backend
cd backend && ./mvnw package -DskipTests

# Frontend
cd frontend && npm install && npm run build && npm start
```

## Environment variables

| Variable           | Default                                      | Description              |
|--------------------|----------------------------------------------|--------------------------|
| `DATABASE_URL`     | `jdbc:postgresql://localhost:5434/authdb`    | JDBC connection string   |
| `DATABASE_USER`    | `auth`                                       | Database username        |
| `DATABASE_PASSWORD`| `auth`                                       | Database password        |
| `JPA_DDL_AUTO`     | `update`                                     | Hibernate schema mode    |
| `JWT_SECRET`       | (dev default in properties)                  | JWT signing key          |

## Stop services

```bash
docker compose down        # keep data volume
docker compose down -v     # remove data volume
```
