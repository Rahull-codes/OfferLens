# OfferLens

AI-powered interview prep platform. Upload a resume and job description to get:

- Match score vs the role
- Technical & behavioral interview questions with model answers
- Skill-gap analysis
- Day-by-day preparation roadmap
- Optimized resume PDF download

---

## Tech Stack

| Layer | Stack |
|---|---|
| **Frontend** | React 18, Vite, React Router, Axios, Sass, React Toastify |
| **Backend** | Node.js, Express 5, MongoDB (Mongoose), JWT, Multer |
| **AI** | Google Gemini (`@google/genai`) |
| **PDF** | `pdf-parse` (resume text extract), Puppeteer (optimized resume PDF) |

---

## Project Structure

```
OfferLens/
├── Backend/                 # Express API
│   ├── server.js            # Entry point
│   ├── .env.example
│   └── src/
│       ├── app.js
│       ├── Controller/
│       ├── Middlewares/
│       ├── model/
│       ├── Routes/
│       ├── config/
│       └── services/        # Gemini + PDF generation
│
└── Frontend/                # React + Vite SPA
    ├── .env.example
    ├── vercel.json          # SPA rewrites for Vercel
    └── src/
        ├── features/
        │   ├── auth/        # Login, register, protected routes
        │   └── interview/   # Home form, report UI, history
        ├── lib/             # API base URL helpers
        └── styles/
```

---

## Features

- **Auth** — Register / login with JWT (Bearer token + cookies)
- **Interview report generation** — Resume PDF + job description → AI report
- **Chat history** — Browse past reports from the home sidebar
- **Interview dashboard** — Technical / Behavioral / Road Map sections
- **Optimized resume** — Generate and download a role-tailored PDF

---

## Prerequisites

- Node.js 18+
- MongoDB Atlas (or local MongoDB)
- Google AI / Gemini API key

---

## Setup

### 1. Clone

```bash
git clone https://github.com/Rahull-codes/OfferLens.git
cd OfferLens
```

### 2. Backend

```bash
cd Backend
cp .env.example .env
npm install
```

Edit `Backend/.env`:

```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_google_api_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the API:

```bash
npm run dev
```

Server runs at `http://localhost:3000`.

### 3. Frontend

```bash
cd Frontend
cp .env.example .env
npm install
```

Edit `Frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

Start the app:

```bash
npm run dev
```

App runs at `http://localhost:5173`.

---

## API Overview

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Create account |
| `POST` | `/login` | Public | Login (returns JWT) |
| `GET` | `/logout` | Public | Logout / blacklist token |
| `GET` | `/get-me` | Private | Current user |

### Interview — `/api/interview`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/` | Private | Generate report (`multipart`: `resume`, `jobDescription`, `selfDescription`) |
| `GET` | `/` | Private | List user's reports |
| `GET` | `/report/:interviewId` | Private | Get one report |
| `POST` | `/resume/pdf/:interviewId` | Private | Download optimized resume PDF |

Private routes accept:

- `Authorization: Bearer <token>`, or
- `token` cookie (with credentials)

---

## Frontend Routes

| Path | Access | Page |
|---|---|---|
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/` | Protected | Home — upload resume & generate report |
| `/interview/:interviewId` | Protected | Interview report dashboard |

---

## Environment Variables

### Backend

| Variable | Description |
|---|---|
| `PORT` | API port (default `3000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `GOOGLE_API_KEY` | Gemini API key |
| `CLIENT_URL` | Frontend origin for CORS (e.g. Vercel URL) |
| `NODE_ENV` | `development` or `production` |

### Frontend

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL (no trailing slash) |

---

## Deployment

### Backend (Render)

| Setting | Value |
|---|---|
| Root Directory | `Backend` |
| Build Command | `npm install` |
| Start Command | `node server.js` |

Set env vars from the Backend table above. Use:

```env
CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

In MongoDB Atlas → Network Access, allow `0.0.0.0/0` (or Render IPs).

### Frontend (Vercel)

| Setting | Value |
|---|---|
| Root Directory | `Frontend` |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Set:

```env
VITE_API_URL=https://your-backend.onrender.com
```

`vercel.json` already rewrites SPA routes so `/login` etc. work on refresh.

---

## Usage Flow

1. Register / log in
2. On Home, paste a **job description**, add an optional **self description**, upload a **resume PDF**
3. Click **Generate Interview Report**
4. Open the report dashboard:
   - Technical & behavioral Q&A (multi-open accordion)
   - Preparation roadmap
   - Match score & skill gaps
5. Download **Optimized Resume** from the left sidebar
6. Reopen past reports from **Chat History**

---

## Notes

- Resume upload limit is **3MB** (PDF only)
- Cross-origin auth uses **Bearer tokens** (stored in `localStorage`) so Vercel ↔ Render works reliably
- Puppeteer on free Render may need extra Chromium setup for resume PDF generation
- Never commit real `.env` files — use `.env.example` as a template

---

## License

ISC
