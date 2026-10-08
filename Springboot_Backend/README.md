# Iftekhar Mahmood Academic Portfolio – Spring Boot Backend

This Spring Boot backend powers the portfolio content, admin management, authentication, and file delivery for the Next.js frontend.

## 1. Start PostgreSQL

```bash
cd ..
docker compose up -d postgres
```

The database listens on `localhost:5432` with database `uncle_portfolio`.

## 2. Configure environment variables

Copy the sample values from the project root:

```bash
cp ../.env.example ../.env
```

Set the required variables before starting the backend:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `CORS_ALLOWED_ORIGINS`
- `MAX_FILE_SIZE_MB`

Never commit a real JWT secret or password.

## 3. Start the Spring Boot app

From the `Springboot_Backend` directory:

```bash
mvn spring-boot:run
```

## 4. Start the Next.js frontend

From the project root, in a separate terminal:

```bash
cd ../Next_Frontend
npm install
npm run dev
```

Public pages read from the backend automatically, and the admin UI is available at:

- http://localhost:3000/admin/login
- http://localhost:3000/admin
- http://localhost:3000/admin/books
- http://localhost:3000/admin/publications
- http://localhost:3000/admin/projects
- http://localhost:3000/admin/cv

## 5. Swagger UI

Once the backend is running, open:

- http://localhost:8080/swagger-ui.html
- http://localhost:8080/v3/api-docs

## 6. Log in to the admin panel

The admin account is seeded from environment variables on first startup.  
Use `POST /api/auth/login` with the values from your `.env`. The server uses an HTTP-only JWT cookie.

The admin UI uploads files through `POST /api/admin/files/upload`, then stores returned asset IDs on book, publication, or CV records.

## 7. Uploaded file storage

Uploaded PDF and image files are stored in PostgreSQL as `BYTEA` in `file_assets`. The file bytes are not returned by normal list endpoints; instead download endpoints stream the file back with the proper content type and filename.

## 8. Change the administrator password

Update `ADMIN_PASSWORD` in your `.env` and restart the app. The seeded admin is created on startup if the username does not already exist.

## 9. Deploy the backend

For production deployment, configure environment variables securely via your host platform or secret manager and run the application with the `prod` profile:

```bash
SPRING_PROFILES_ACTIVE=prod mvn spring-boot:run
```

Use HTTPS, a strong `JWT_SECRET`, and a hardened PostgreSQL connection string in production.

## Database and migration notes

- Flyway runs automatically at startup.
- Migrations are stored in `src/main/resources/db/migration`.
- The schema includes admin users, portfolios, file assets, CV data, and audit metadata.
