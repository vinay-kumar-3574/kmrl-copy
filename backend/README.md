# KMRI Flow Smart - Backend (Node + Express + Firebase Admin)

## Prerequisites
- Node 18+
- Firebase project with Service Account credentials

## Setup
1. Copy environment template and fill values:
```bash
cp .env.example .env
```

Required vars (choose ONE method):
- FIREBASE_SERVICE_ACCOUNT_JSON (entire JSON as one string)
- OR FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY

Other vars:
- PORT (default 8080)
- CORS_ORIGIN (default http://localhost:5173)
- FIREBASE_STORAGE_BUCKET (your-bucket.appspot.com)

2. Install deps (already installed):
```bash
npm i
```

3. Run dev:
```bash
npm run dev
```

4. Build: N/A (plain JS)

## API
Base URL: `/api`

- GET `/health` → `{ ok, ts }`

Auth: Send `Authorization: Bearer <Firebase ID token>` from the frontend after Firebase client login.

### Users
- GET `/users/me`
- PUT `/users/me` body: `{ name?, title?, department?, phone?, avatar?, bio?, skills? }`

### Documents
- GET `/documents`
- POST `/documents/upload` multipart form: `file`, `title`, `sector`, `projectId?`, `tags?` (JSON array)
- DELETE `/documents/:id`

### Employees (optional)
- GET `/employees`
- POST `/employees` body: `{ name, employeeId, department, title? }`

### Projects (optional)
- GET `/projects`
- POST `/projects` body: `{ title, sector, status, description? }`

## Notes
- Ensure Storage security rules allow Admin SDK access (server-side is privileged).
- Frontend should use Firebase Auth client SDK to obtain ID tokens and pass them to backend.
