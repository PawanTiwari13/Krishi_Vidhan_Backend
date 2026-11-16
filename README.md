# Krishi Vidhan — Enterprise Backend API

Modular Monolith REST API built with **NestJS 10**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

## Getting Started

1. Copy `.env.example` to `.env` and configure your environment variables.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run database migrations & seed:
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```
4. Start the development server:
   ```bash
   npm run start:dev
   ```
   - API Base URL: `http://localhost:8080/api/v1`
   - Health Check: `http://localhost:8080/api/v1/health`
   - Swagger Docs: `http://localhost:8080/api/docs`

