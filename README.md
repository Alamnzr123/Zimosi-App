<h1 align="center">
      Zimosi App (Manage Task Management)
</h1>

This project is an Express + TypeScript backend using MongoDB and Redis. The repo includes Docker configuration to run the full stack locally.

Prerequisites

- Node.js (16+) or Docker

Quick start (recommended: Docker)

1. Build and run with Docker Compose (starts Mongo, Redis and the app):

```powershell
docker compose up --build
```

2. Open API docs (Swagger):

```
http://localhost:3000/api-docs
```

Local (non-Docker)

1. Copy `.env.example` to `.env` and edit as needed.

````powershell
# Zimosi App — backend-zimozi-2025

Zimosi App is a TypeScript + Express backend designed to demonstrate a production-friendly architecture for complex task management: users, tasks, history, comments, notifications and background jobs. The project includes MongoDB for persistent storage, Redis for caching and job queues (BullMQ), structured logging, OpenAPI docs and Docker Compose for local development.

This README covers features, architecture, tech stack, and exact commands to run the app locally and in Docker.

## Features

- User management (CRUD)
- Task management (CRUD) with due dates and statuses
- Task history, comments, and user-task relationships
- Background notification queue using BullMQ
- Redis caching for read performance
- JWT-based authentication and role-based access control (Manager, Admin, User)
- Structured logging (Winston)
- OpenAPI / Swagger UI at `/api-docs`
- Environment validation (zod) and improved error handling
- Docker + docker-compose for reproducible local environments

## Architecture (high level)

- Express app (TypeScript)
- MongoDB (document DB) for domain data
- Redis for caching and BullMQ connection (job queue)
- BullMQ workers for processing asynchronous notifications
- Structured logs emitted via Winston (console JSON output)
- OpenAPI (swagger-jsdoc + swagger-ui-express) for API exploration

Diagram: see `documentation/Backend Architecture Diagram.drawio` in the repository for a visual overview.

## Technology stack

- Node.js (TypeScript)
- Express
- Mongoose (MongoDB ODM)
- Redis (node-redis)
- BullMQ (background jobs)
- Winston (structured logs)
- Swagger (OpenAPI) for docs
- Docker + Docker Compose for local development

## Quick start (recommended: Docker)

1. Build and run everything (app, MongoDB, Redis):

```powershell
docker compose up --build
````

2. Open the API docs in your browser:

```text
http://localhost:3000/api-docs
```

3. Stop the stack:

```powershell
docker compose down
```

Notes:

- The compose file wires `MONGO_URL` and `REDIS_URL` into the app and includes persistent volumes for Mongo and Redis.

## Local development (without Docker)

1. Copy environment example and edit as necessary:

```powershell
copy .env.example .env
notepad .env
```

2. Install dependencies and run in development (tsx):

```powershell
npm install
npm run start
```

3. Build and run the compiled app (production mode):

```powershell
npm run build
npm run start:prod
```

## Environment variables

Important variables are provided in `.env.example`. Key variables:

- MONGO_URL — MongoDB connection string (default compose: `mongodb://mongo:27017/users`)
- REDIS_URL — Redis connection string (default compose: `redis://redis:6379`)
- PORT — HTTP port (default 3000)
- NODE_ENV — `development` or `production`

## API documentation

Swagger UI is auto-generated and available at `/api-docs` when the app is running (local or Docker).

Add or expand JSDoc `@openapi` comments in routes/controllers to improve the generated spec.

## Health & readiness

The project includes improved error handling and will expose health endpoints (recommendation). If a `/health` endpoint is not present, you can add one that checks Mongo and Redis connectivity and returns 200/503 accordingly. I can add this for you and include it in the OpenAPI definition.

## Security & Rate Limiting

- JWT authentication is used — tokens are signed with HS256 and verified with an explicit algorithm requirement.
- Global rate-limiting is recommended. The repo already uses `express-rate-limit`; to make it production-ready, use a Redis-backed store (e.g., `rate-limit-redis`) when running multiple instances.

## Logging

- Winston is used for structured JSON logs. In development we log debug; in production we log info.

## Data models (overview)

- Users: { UsersId, Name, Roll, Birthday, Address }
- Tasks: { TasksId, TasksName, TasksDescription, TasksStatus, TasksDueDate }
- TasksHistory, TasksComment, Notification, UserTasks: related documents for history/comments/notifications

The Mongoose schemas and TypeScript interfaces are defined in `api/helper/config.ts`.

## Background jobs

- BullMQ is used for background processing and notifications. Redis is the broker and persistence store for job state.

## Testing & CI (suggestions)

- Add a GitHub Actions workflow to build the code and run a small smoke test against `/health` and `/api-docs` after bringing services up with Docker Compose.
- Add unit tests for controllers with mocked Mongoose and integration tests using a test MongoDB instance (e.g., `mongodb-memory-server`).

## Troubleshooting

- If Mongo connection fails, ensure `MONGO_URL` is correct or start `docker compose up` to create a local Mongo.
- If Redis errors appear, confirm `REDIS_URL` and whether Redis is running.

## Contribution & roadmap

- Improve OpenAPI coverage (add schemas & more endpoint docs)
- Add `/health` endpoint and readiness checks
- Add Redis-backed rate limiter for production
- Add CI pipeline to validate builds and API smoke tests

## License

This project uses an ISC license (see `package.json`).

---
