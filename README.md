# Chat Application Monorepo

This repository is a monorepo for a scalable chat application built with [Turborepo](https://turbo.build/repo) and utilizes multiple technologies to ensure scalability, efficiency, and real-time communication.

## Overview

This chat application is built using:

- **Frontend**: Next.js for the web client.
- **Backend**: Node.js for the server-side logic.
- **Message Channeling**: Redis is used for pub/sub messaging.
- **Data Storage**: PostgreSQL with Prisma for database ORM.
- **Message Queue**: Kafka is utilized for distributed messaging and scalability.

### Architectural Flow

1. When a message is sent from the client, it is first sent to **Redis** for quick pub/sub handling.
2. The message is then pushed to **Kafka** to handle distribution to multiple servers.
3. The message is stored in **PostgreSQL** via **Prisma** for persistence.
4. Finally, the message is distributed to all servers running the application to ensure all clients receive the message in real-time.

## Architecture Diagram

![Architecture Diagram](sd.png)

## Getting Started

### Prerequisites

Ensure you have the following installed on your local development machine:

- [Node.js](https://nodejs.org/) v14.x or later
- [Yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) v12.x or later
- [Redis](https://redis.io/) v6.x or later
- [Kafka](https://kafka.apache.org/) v2.x or later

### Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/priyanshusinha11/chat-app.git
    cd chat-app
    ```

2. Install all dependencies:

    ```bash
    yarn install
    ```

3. Set up the database:

    Create a `.env` file in the root directory with your PostgreSQL connection details:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/chatdb"
    ```

    Then run the following command to set up the database schema:

    ```bash
    yarn prisma migrate dev
    ```

### Running the Application

To start both the client and server applications:

```bash
yarn dev

## Building the Application

This command will run both the Next.js frontend and the Node.js backend simultaneously.

### To build all apps and packages, run:

```bash
yarn build
```

### Technology used
- Next.js: Framework for building the web client.
- Node.js: Server-side runtime for handling backend logic.
- Redis: In-memory data structure store for pub/sub messaging.
- PostgreSQL: Relational database for message persistence.
- Prisma: ORM for PostgreSQL to handle database operations.
- Kafka: Distributed event streaming platform for message queueing.
- Turborepo: Tool for managing monorepos, build optimization, and remote caching.
- Yarn: Package manager for managing project dependencies.

### Useful Commands
- Start Development: yarn dev - Starts both frontend and backend servers.
- Build Application: yarn build - Builds all apps and packages.
- Database Migration: yarn prisma migrate dev - Runs the Prisma migrations.

