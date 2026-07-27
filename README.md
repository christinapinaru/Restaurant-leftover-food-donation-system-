<<<<<<< HEAD
# GoodPlate — Restaurant Leftover Food Donation System

A full-stack app connecting **restaurants** with surplus food to **NGOs / receivers**,
with an **admin** role to oversee the whole platform.

- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth
- **Frontend:** Plain HTML/CSS/JavaScript (no framework/build step required)

## Project structure

```
restaurant-leftover-food/
├── backend/           # Express + MongoDB API
│   ├── config/db.js
│   ├── controllers/   # authController, foodController, requestController
│   ├── middleware/    # authMiddleware (JWT + roles), errorMiddleware
│   ├── models/        # User, Food, Request
│   ├── routes/        # authRoutes, foodRoutes, requestRoutes
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/           # Static site (open with Live Server or any static host)
│   ├── src/
│   │   ├── css/style.css
│   │   └── js/ (api.js, auth.js, utils.js, dashboard-*.js)
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard-restaurant.html
│   ├── dashboard-receiver.html
│   └── dashboard-admin.html
└── Postman_Collection.json
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/restaurant_leftover_food
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5500
```

- If you use **MongoDB Atlas**, paste your Atlas connection string into `MONGO_URI` instead.
- `CLIENT_URL` should match wherever you serve the frontend from (CORS).

Start MongoDB locally (if using local Mongo), then run the server:

```bash
npm run dev     # with nodemon, auto-restarts on changes
# or
npm start
```

You should see:
```
MongoDB Connected: ...
Server running on port 5000
```

Test it's alive: open `http://localhost:5000/api/health` in a browser.

## 2. Frontend setup

The frontend is plain static files — no build step needed.

**Option A — VS Code Live Server extension**
1. Open the `frontend` folder in VS Code.
2. Right-click `index.html` → "Open with Live Server".
3. It'll open at something like `http://localhost:5500`.

**Option B — Node's `serve` package**
```bash
cd frontend
npx serve -p 5500
```

**Important:** If your frontend runs on a different port than `5500`, update:
- `backend/.env` → `CLIENT_URL` to match your frontend's URL
- `frontend/src/js/api.js` → `API_BASE_URL` if your backend isn't on `http://localhost:5000/api`

## 3. Using the app

1. Go to `register.html`, create a **Restaurant** account and a **Receiver/NGO** account (use two different browsers/incognito windows, or log out between them).
2. As the restaurant, create a food listing (Dashboard → "+ New Listing").
3. As the receiver, browse "Available Food" and click "Request this food".
4. As the restaurant, go to "Incoming Requests" and Accept / Reject. Once accepted, mark it "Completed" after pickup.
5. **Admin account:** admin signup is protected — see below.

### Creating the first Admin account

For security, `role: "admin"` cannot be created through the public register form unless
an `adminSecret` matching your `.env`'s `JWT_SECRET` is supplied. Use Postman (or curl) to create your first admin:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Platform Admin",
    "email": "admin@example.com",
    "password": "admin123456",
    "role": "admin",
    "adminSecret": "PASTE_YOUR_JWT_SECRET_HERE"
  }'
```

Then log in at `login.html` with that email/password — you'll land on the admin dashboard,
where you can view/deactivate/delete users, see all listings, and see all requests.

## 4. API testing with Postman

Import `Postman_Collection.json` into Postman. It includes requests for every endpoint
(register, login, food CRUD, request lifecycle). After logging in, copy the returned
`token` into the collection's `token` variable to authenticate subsequent requests.

## 5. API overview

| Method | Endpoint                      | Access              | Purpose                        |
|--------|--------------------------------|----------------------|---------------------------------|
| POST   | /api/auth/register             | Public               | Register (restaurant/receiver, admin needs secret) |
| POST   | /api/auth/login                | Public               | Log in, get JWT                |
| GET    | /api/auth/me                   | Private              | Current user profile           |
| PUT    | /api/auth/me                   | Private              | Update own profile             |
| GET    | /api/auth/users                | Admin                | List all users                 |
| PUT    | /api/auth/users/:id/status     | Admin                | Activate/deactivate a user     |
| DELETE | /api/auth/users/:id            | Admin                | Delete a user                  |
| POST   | /api/food                      | Restaurant           | Create a food listing          |
| GET    | /api/food                      | Private              | List food (`?status=`, `?mine=true`) |
| GET    | /api/food/:id                  | Private              | Get one listing                |
| PUT    | /api/food/:id                  | Restaurant (owner)/Admin | Update listing              |
| DELETE | /api/food/:id                  | Restaurant (owner)/Admin | Delete listing               |
| POST   | /api/requests                  | Receiver             | Request a food listing         |
| GET    | /api/requests/my               | Receiver              | My requests                    |
| GET    | /api/requests/received         | Restaurant             | Requests received on my listings |
| PUT    | /api/requests/:id/status       | Restaurant/Receiver/Admin | accept/reject/complete/cancel |
| GET    | /api/requests                  | Admin                 | All requests                   |

## 6. Notes

- Passwords are hashed with `bcryptjs`; never stored in plain text.
- Auth uses JWT bearer tokens (`Authorization: Bearer <token>`), stored in `localStorage` on the frontend.
- Food listings auto-flip to `expired` status once their `expiryTime` passes.
- The frontend visual theme ("GoodPlate") uses a ticket/ledger motif — each food
  listing renders as a tear-away ticket card.
=======
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
>>>>>>> bda4fdcc6fc70b8868d041251866274e892445e0
