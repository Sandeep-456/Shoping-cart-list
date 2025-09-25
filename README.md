# Shopping List Web App

A full-stack shopping list application built with React (Vite), Tailwind CSS, and Node.js (Express).

## Features

- Add items with name, quantity, category, and note
- Edit and delete existing items
- Filter by search text and category
- Responsive design for desktop and mobile
- Loading, error, and empty states
- Simple JSON file persistence on the server

## Project Structure

- `client/` – React app (Vite)
- `server/` – Express API with file-based persistence

## Getting Started

Prerequisites:
- Node.js 18+

### 1) Install dependencies

Open two terminals, one for `server/` and one for `client/`.

Server:

```bash
cd server
npm install
```

Client:

```bash
cd client
npm install
```

### 2) Run in development

Server (port 4000):

```bash
npm run dev
```

Client (port 5173):

```bash
npm run dev
```

Vite is configured to proxy `/api` to `http://localhost:4000`, so the React app can call the Express API without CORS issues.

### 3) Build client for production

```bash
cd client
npm run build
```

## API Endpoints

- `GET /api/items` – list items
- `POST /api/items` – create item `{ name, quantity, category, note }`
- `PUT /api/items/:id` – update item by id
- `DELETE /api/items/:id` – delete item by id

## Deployment

This application is ready to be deployed with the frontend on Vercel and the backend on Render.

### Environment Variables

You will need to set the following environment variables in your hosting provider's dashboard.

#### Frontend (Vercel)

Set this variable in your Vercel project settings:

- `VITE_API_BASE_URL`: The public URL of your deployed backend on Render (e.g., `https://your-api.onrender.com`).

#### Backend (Render)

Set this variable in your Render service settings:

- `CORS_ORIGIN`: The public URL of your deployed frontend on Vercel (e.g., `https://your-app.vercel.app`).

## Notes

- Data is stored in `server/data/items.json`. You can delete this file to reset the list.
- For persistence beyond simple file storage, swap in a DB (e.g., SQLite, MongoDB) behind the same endpoints.
