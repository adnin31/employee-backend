# Employee Backend

NestJS REST API with PostgreSQL, RabbitMQ, and Docker.

---

## ✅ Prerequisites

Make sure the following are installed before running the project:

| App | Version | Download |
|-----|---------|----------|
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Latest | Required to run containers |
| [OrbStack](https://orbstack.dev/) *(recommended, macOS only)* | Latest | Faster Docker alternative with magic `.orb.local` HTTPS domains |
| [Node.js](https://nodejs.org/) | v18+ | Only needed for local development without Docker |

> **Note:** You only need either Docker Desktop **or** OrbStack — not both. OrbStack is recommended for macOS.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone git@adnin-personal:adnin31/employee-backend.git
cd employee-backend
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` if needed (defaults work out of the box with Docker):

```env
POSTGRES_USER=root
POSTGRES_PASSWORD=rootpassword
POSTGRES_DB=employee_db
DATABASE_URL=postgres://root:rootpassword@db:5432/employee_db
RABBITMQ_URL=amqp://rabbitmq:5672
JWT_SECRET=supersecretjwt
PORT=7000
```

### 3. Start all services

```bash
docker-compose up --build
```

This will start:
- **PostgreSQL** — database on port `5432`
- **RabbitMQ** — message broker on port `5672`
- **NestJS API** — REST API on port `7000`

### 4. Seed the admin user

Once the containers are running, create the default HRD admin account:

```bash
docker exec employee-backend-db-1 psql -U root -d employee_db -c \
  "INSERT INTO users (id, email, password, name, phone_number, position, role, created_at, updated_at)
   VALUES (gen_random_uuid(), 'admin@company.com', '\$2b\$10\$2tH09EWQipiYAE8RR9G00.knY2s5JnkCY5aeqxv3xNRiWz7VwH1Me', 'Admin HR', '081234567890', 'HR Manager', 'HRD', NOW(), NOW())
   ON CONFLICT DO NOTHING;"
```

**Default credentials:**
- Email: `admin@company.com`
- Password: `admin123`

---

## 🌐 Accessing the API

| Mode | URL |
|------|-----|
| Via OrbStack domain | `https://api.employee-backend.orb.local` |
| Via localhost | `http://localhost:7000` |

Base path for all endpoints: `/api/v1`

---

## 📋 Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/users/login` | Login and get JWT token |
| `GET` | `/api/v1/users/profile` | Get logged-in user profile |
| `GET` | `/api/v1/users/admin/manage` | List all employees (HRD only) |
| `POST` | `/api/v1/users/admin/manage` | Create employee (HRD only) |
| `PATCH` | `/api/v1/users/admin/manage/:id` | Update employee (HRD only) |
| `DELETE` | `/api/v1/users/admin/manage/:id` | Delete employee (HRD only) |
| `POST` | `/api/v1/attendance/check-in` | Employee check-in |
| `POST` | `/api/v1/attendance/check-out` | Employee check-out |
| `GET` | `/api/v1/attendance/summary` | Attendance summary |

---

## 🛑 Stopping the Services

```bash
docker-compose down
```

To also remove all data (database volumes):

```bash
docker-compose down -v
```
