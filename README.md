# Mini Kanban Manager

A full-stack Kanban-style Task Manager built with Node.js/Express (MVC) and React/Vite.

## Features
- **MVC Architecture**: Backend organized into models, controllers, and routes.
- **Kanban Board**: Drag tasks between "To Do" and "Done".
- **Real-time Updates**: Instant UI feedback for adding, moving, and deleting tasks.
- **Responsive Design**: Modern UI that works across devices.

## Project Structure
```text
.
├── backend/          # Express API (MVC)
│   ├── controllers/  # Request handlers
│   ├── models/       # Data logic
│   ├── routes/       # API endpoints
│   └── server.js     # Entry point
├── frontend/         # React Application (Vite)
│   ├── src/
│   │   ├── api/      # API services
│   │   ├── components/ # UI components
│   │   └── App.jsx   # Main view
│   └── index.html
└── README.md
```

## Local Development

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Run Locally
```bash
npm run dev
```
- Backend: `http://localhost:5001`
- Frontend: `http://localhost:3000`

## Deployment Instructions

### Backend (e.g., Render)
1. Link your GitHub repo.
2. Select the `backend` directory as the root.
3. Build Command: `npm install`
4. Start Command: `node server.js`

### Frontend (e.g., Vercel)
1. Link your GitHub repo.
2. Select the `frontend` directory as the root.
3. Set Environment Variable: `VITE_API_URL = [Your Deployed Backend URL]`
4. Build Command: `npm run build`
5. Output Directory: `dist`
