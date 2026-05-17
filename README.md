# Inventory Management System (Spring Boot)

Production-ready REST API for inventory operations: categories, products, stock, suppliers, pricing, invoices, and audit logs. Includes JWT authentication, role-based access, Flyway migrations, OpenAPI docs, Docker deployment, and CI.

## Stack

- Java 17, Spring Boot 3.2
- MySQL 8, Flyway
- Spring Security + JWT
- Springdoc OpenAPI (Swagger UI)
- Docker & GitHub Actions CI

## Full stack (backend + frontend UI)

**Terminal 1 — API:**
```powershell
$env:SPRING_PROFILES_ACTIVE = "standalone"
.\mvnw.cmd spring-boot:run
```

**Terminal 2 — Web UI:**
```powershell
cd frontend
npm install
npm run dev
```

Or start both in separate windows:
```powershell
.\start-all.ps1
```

| App | URL |
|-----|-----|
| **Web UI** | http://localhost:3000 |
| **API** | http://localhost:8080/api/v1 |
| **Swagger** | http://localhost:8080/api/v1/swagger-ui/index.html |

Login: `admin` / `admin123`

The UI includes: Dashboard, Categories, Products, Stock, Suppliers, Pricing, Invoices, Product links, and Admin Users/Roles.

---

## Quick start (Windows — API only)

**Prerequisites:** JDK 17 was installed via `winget` on this machine. Open a **new** PowerShell window in the project folder.

```powershell
.\start.ps1
```

Or manually:

```powershell
$env:SPRING_PROFILES_ACTIVE = "standalone"
.\mvnw.cmd spring-boot:run
```

`standalone` uses an embedded **H2 database** (no MySQL, no Docker required).

API base URL: `http://localhost:8080/api/v1`  
Swagger UI: `http://localhost:8080/api/v1/swagger-ui/index.html`  
(OpenAPI JSON: `http://localhost:8080/api/v1/v3/api-docs`)

## Quick start (Docker)

**Start Docker Desktop first** (whale icon in system tray must be running), then:

```bash
docker compose up --build
```

Default admin (created on first startup):

| Field    | Value     |
|----------|-----------|
| Username | `admin`   |
| Password | `admin123`|

## Quick start (local)

1. Copy environment template:

```bash
cp .env.example .env
```

2. Start MySQL and create database `inventory` (or set `DB_*` variables).

3. Run the application:

```bash
./mvnw spring-boot:run
```

Flyway applies schema and seed data automatically.

## Authentication

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

Use the returned JWT on protected routes:

```bash
curl http://localhost:8080/api/v1/categories \
  -H "Authorization: Bearer <token>"
```

## Main endpoints

| Resource          | Path                    |
|-------------------|-------------------------|
| Auth              | `/auth/login`, `/auth/register` |
| Categories        | `/categories`           |
| Products          | `/products`             |
| Stock             | `/stocks`               |
| Suppliers         | `/suppliers`            |
| Pricing           | `/pricings`             |
| Invoices          | `/invoices`             |
| Product pricing   | `/product-pricings`     |
| Product invoice   | `/product-invoices`     |
| Users (ADMIN)     | `/users`                |
| Roles (ADMIN)     | `/roles`                |

## Configuration

| Variable            | Default   | Description        |
|---------------------|-----------|--------------------|
| `DB_HOST`           | localhost | MySQL host         |
| `DB_NAME`           | inventory | Database name      |
| `DB_USERNAME`       | root      | Database user      |
| `DB_PASSWORD`       | root      | Database password  |
| `JWT_SECRET`        | (see yml) | JWT signing secret |
| `SPRING_PROFILES_ACTIVE` | dev  | `dev`, `prod`, `test` |

## Production profile

Set `SPRING_PROFILES_ACTIVE=prod` and provide strong `JWT_SECRET`, `DB_*` credentials, and HTTPS in front of the app (reverse proxy or cloud load balancer).

## Tests

```bash
./mvnw test
```

Uses in-memory H2 with the `test` profile (Flyway disabled).

## License

See repository license. Demo screenshots in the original project README remain applicable for UI concepts; this repository ships the API layer.
