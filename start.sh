#!/bin/bash

# Start Docker services
echo "Starting Docker services (Redis, Kafka, PostgreSQL)..."
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 10

# Run database migrations
echo "Running database migrations..."
cd apps/server
npx prisma migrate dev --name init

# Start the application
echo "Starting the application..."
cd ../..
yarn dev 