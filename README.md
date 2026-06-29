# Restaurant Leftover Food Donation System

This repository contains a simple food donation application with a Node.js backend and a React + Vite frontend.

## Setup

1. Install root dependencies for the backend:

```bash
npm install
```

2. Install frontend dependencies:

```bash
cd frontend
npm install
```

## Run

### Backend

From the repository root:

```bash
npm run server
```

This starts the Express backend on http://localhost:5000.

### Frontend

From the repository root:

```bash
npm run client
```

This opens the React frontend in the frontend folder via Vite.

### Build frontend

From frontend:

```bash
npm run build
```

## Available backend routes

- GET /all — list food donations
- POST /add — post a new food item
- POST /request — create a request
- GET /requests — list requests
- POST /confirm — confirm a request
- GET /history — view donation history

## Notes

- The backend uses MongoDB if MONGO_URL is configured; otherwise it falls back to in-memory data.
- Set MONGO_URL before starting the backend if you want persistent storage, for example:

```bash
set MONGO_URL=mongodb://127.0.0.1:27017/fooddonation
npm run server
```

- The frontend is located in the frontend/ folder.
