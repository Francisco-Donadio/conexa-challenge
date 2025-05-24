<p align="center">
  <img src="./assets/Star_Wars_Logo.png" width="300" alt="Star Wars Logo" />
</p>

## Description

This is a backend API built with NestJS that manages Star Wars movies, users, and authentication.  
It supports JWT-based login, role-based access control, and syncing movie data from the public SWAPI.

## Installation

```bash
$ npm install
```

## ⚙️ Environment configuration

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"
JWT_SECRET="your-secret-key"

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Documentation

This project includes auto-generated Swagger documentation using @nestjs/swagger.

Once the app is running, you can access the Swagger UI at:
http://localhost:3000/api

It provides:

- Descriptions for all available endpoints
- Request and response schemas
- Authentication requirements using JWT Bearer tokens

🔐 How to use

After logging in via POST /auth/login, copy the token received and click the Authorize button in Swagger UI to enable authenticated routes.

🐳 Development with Docker

This project includes a docker-compose.yml file for local development with PostgreSQL and Adminer (a lightweight DB GUI).

▶️ Start services

docker-compose up -d

- PostgreSQL is available at: localhost:5432
- Adminer is available at: http://localhost:8080

In Adminer:

- System: PostgreSQL
- Server: postgres
- Username: postgres
- Password: postgres
- Database: mydb

## 🚀 Deployment on Render

This project is deployed on [Render](https://render.com), using:

- Node.js + NestJS
- PostgreSQL as database (via Render DB)
- Prisma for ORM
- JWT for authentication and role-based access

### 🔗 Production URL

👉 https://conexa-challenge-wfvm.onrender.com

### 🔧 Environment Variables

Make sure the following variables are set in your Render dashboard:

| Variable       | Example Value                                       |
| -------------- | --------------------------------------------------- |
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db?schema=public` |
| `JWT_SECRET`   | `your-super-secret-key`                             |

### 🏗 Build Command

For the first build:

```bash
npm install && npx prisma generate && npx prisma migrate deploy && npm run build
```
