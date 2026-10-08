# Uncle Portfolio

A full-stack academic portfolio application built with **Spring Boot** (backend) and **Next.js** (frontend).  
It includes a public-facing portfolio page and a password-protected admin panel for managing books, publications, projects, and a CV.

---

## Project Structure

```
Uncle_portfolio/
├── backend/                  # Spring Boot REST API (Java 17+)
│   └── src/
│       └── main/
│           ├── java/         # Application source code
│           └── resources/    # YAML configs & Flyway migrations
├── my-next-portfolio-app/    # Next.js 14 frontend
│   └── src/
│       ├── app/              # App Router pages (public + /admin)
│       ├── components/       # React components
│       ├── lib/              # API client utilities
│       └── data/             # Static JSON fallback data
├── docker-compose.yml        # PostgreSQL database service
├── .env.example              # ← Copy to .env and fill in values
└── .gitignore
```

---

## Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Java | 17+ |
| Maven | 3.9+ |
| Node.js | 18+ |
| Docker | (for PostgreSQL) |

### 1. Configure environment variables

```bash
cp .env.example .env
# Edit .env and fill in all required values
```

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore`.

### 2. Start PostgreSQL

```bash
docker compose up -d postgres
```

The database listens on `localhost:5432` (or the port set in `.env`).

### 3. Start the backend

```bash
cd backend
mvn spring-boot:run
```

The API server starts at [http://localhost:8080](http://localhost:8080).

### 4. Start the frontend

```bash
cd my-next-portfolio-app
npm install
npm run dev
```

The frontend starts at [http://localhost:3000](http://localhost:3000).

---

## Admin Panel

| URL | Description |
|-----|-------------|
| `/admin/login` | Admin login |
| `/admin` | Dashboard |
| `/admin/books` | Manage books |
| `/admin/publications` | Manage publications |
| `/admin/projects` | Manage projects |
| `/admin/cv` | Manage CV |

The admin account is seeded from `ADMIN_USERNAME` / `ADMIN_PASSWORD` environment variables on first startup.

---

## API Documentation

Once the backend is running, view the Swagger UI:

- [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

## Environment Variables Reference

See [`.env.example`](.env.example) for the full list with descriptions.

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_PASSWORD` | ✅ | PostgreSQL password |
| `JWT_SECRET` | ✅ | Min 32-character random secret |
| `ADMIN_USERNAME` | ✅ | Admin login username |
| `ADMIN_PASSWORD` | ✅ | Admin login password |
| `DB_URL` | Optional | Defaults to `localhost:5432/uncle_portfolio` |
| `DB_USERNAME` | Optional | Defaults to `postgres` |
| `CORS_ALLOWED_ORIGINS` | Optional | Defaults to `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Optional | Defaults to `http://localhost:8080` |

---

## Production Deployment

Run with the `prod` Spring profile for stricter security settings:

```bash
SPRING_PROFILES_ACTIVE=prod mvn spring-boot:run
```

Production checklist:
- Use HTTPS
- Set a strong, unique `JWT_SECRET`
- Use a managed PostgreSQL instance
- Set `CORS_ALLOWED_ORIGINS` to your actual domain

---

## Tech Stack

**Backend**
- Spring Boot 3 · Spring Security · Spring Data JPA
- PostgreSQL · Flyway migrations
- JWT (HTTP-only cookie) · CSRF protection
- Springdoc / Swagger UI

**Frontend**
- Next.js 14 (App Router) · React
- Vanilla CSS

---

## License

This project is private. All rights reserved.
