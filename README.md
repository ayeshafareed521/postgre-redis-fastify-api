Fastify PostgreSQL Redis API

A simple RESTful backend API built with Fastify, PostgreSQL, and Redis.The Fastify application runs locally on the host machine, while PostgreSQL and Redis are containerized using Docker Compose.

Overview

This project demonstrates a clean backend structure for building a Node.js API with:

Fastify for the HTTP server and routing

PostgreSQL for persistent relational data

Redis for caching and in-memory data

Docker Compose for managing PostgreSQL and Redis

Environment variables for configuration

The current API provides CRUD operations for users.

Architecture

                Fastify API
              localhost:3000
                     |
          +----------+----------+
          |                     |
          v                     v
     PostgreSQL               Redis
       Docker                 Docker
     localhost:5432         localhost:6379

Fastify runs directly on the development machine, while PostgreSQL and Redis run in Docker containers.

Technologies

Technology

Purpose

Node.js

JavaScript runtime

Fastify

Web framework and REST API

PostgreSQL

Relational database

Redis

In-memory data store / caching

Docker

Containerization

Docker Compose

PostgreSQL and Redis orchestration

pg

PostgreSQL client for Node.js

redis

Redis client for Node.js

Project Structure

postgre_fastify_api/
│
├── config/
│   ├── db.js                 # PostgreSQL connection
│   └── redis.js              # Redis connection
│
├── controllers/
│   └── userController.js     # Handles API requests/responses
│
├── routes/
│   └── userRoutes.js         # User API routes
│
├── services/
│   └── userService.js        # Database/business operations
│
├── app.js                    # Fastify application setup
├── server.js                 # Application entry point
│
├── docker-compose.yml        # PostgreSQL and Redis containers
├── .env.example              # Environment variable template
├── .gitignore                # Git ignored files
├── package.json              # Project dependencies and scripts
├── package-lock.json
└── README.md

API

The project currently provides the following user endpoints:

Method

Endpoint

Description

GET

/users

Get all users

GET

/users/:id

Get a user by ID

POST

/users

Create a user

PUT

/users/:id

Update a user

DELETE

/users/:id

Delete a user

Configuration

Create a .env file in the project root using .env.example as a reference.

Example:

DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=myuser
DB_PASSWORD=your_password
DB_NAME=postgres

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

PORT=3000

The .env file contains local configuration and should not be committed to GitHub.

Running the Project

1. Install dependencies

npm install

2. Start PostgreSQL and Redis

docker compose up -d

3. Start the Fastify server

node server.js

The API will be available at:

http://localhost:3000

Docker Services

Service

Port

Purpose

PostgreSQL

5432

Application database

Redis

6379

Cache / in-memory storage

Development

To stop the Docker services:

docker compose stop

To start them again:

docker compose start

To check their status:

docker compose ps

Backend project built with Fastify, PostgreSQL, Redis, and Docker.