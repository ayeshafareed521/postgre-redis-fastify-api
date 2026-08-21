# Fastify PostgreSQL Redis API

A backend API built with **Node.js, Fastify, PostgreSQL, Redis, and Socket.IO**.

The project provides REST APIs, real-time chat functionality, Redis-based rate limiting, and PostgreSQL data persistence.

## Tech Stack

- **Node.js + Fastify** — Backend REST API
- **PostgreSQL** — Persistent database
- **Redis** — Rate limiting and real-time state
- **Socket.IO** — Real-time chat
- **Docker Compose** — PostgreSQL and Redis containers

## Architecture

```text
Client
  │
  ├── REST API ──→ Fastify ──→ PostgreSQL
  │
  └── Socket.IO ─→ Chat ─────→ Redis
                         │
                         └──→ PostgreSQL

Fastify and Socket.IO run on the host machine, while PostgreSQL and Redis run in Docker.
```
 ## Project Structure

```text
postgre_fastify_api/
├── config/
├── controllers/
├── middleware/
├── routes/
├── services/
├── sockets/
├── server.js
├── app.js
├── docker-compose.yml
├── chat-test.html
├── .env.example
└── README.md
```
## Features

RESTful API with Fastify
PostgreSQL database integration
Redis integration
Redis-based rate limiting
Real-time chat with Socket.IO
Persistent chat messages
Online user tracking
Singleton Redis and Socket.IO instances
Dockerized PostgreSQL and Redis

## Setup

1. Install dependencies
   npm install
2. Configure environment variables

Create a .env file:

PORT=3000

DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=myuser
DB_PASSWORD=your_password
DB_NAME=postgres

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
3. Start PostgreSQL and Redis
docker compose up -d

Check their status:

docker compose ps
4. Start the API
node server.js

The API runs on:

http://localhost:3000

## Chat Testing

Open chat-test.html in two browser tabs/windows to test real-time communication between two clients.
