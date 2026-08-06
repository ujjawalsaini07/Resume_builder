# AI Resume Builder

Full-stack AI Resume Builder with a React + Vite frontend and an Express + MongoDB backend.

This repository is organized as a monorepo with two applications:
- `client`: web app for resume creation, editing, preview, sharing, and download.
- `server`: API service for authentication, user profile data, resume data operations, and AI-assisted content generation.

## Table of Contents
- [Overview](#overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Monorepo Structure (Detailed)](#monorepo-structure-detailed)
- [Application Flow](#application-flow)
- [API Documentation](#api-documentation)
- [Postman Collection](#postman-collection)
- [Data Models](#data-models)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Run Commands](#run-commands)
- [Security Notes](#security-notes)

## Overview
AI Resume Builder enables users to:
- create and manage multiple resumes,
- edit resume sections in a guided step-by-step builder,
- switch templates and accent colors,
- control resume visibility (private/public),
- preview resumes through public and app-based URLs,
- download printable resume output,
- authenticate via login/register flow backed by JWT,
- enhance summaries and experience descriptions with AI (Gemini),
- upload an existing resume (PDF, extracted client-side) and have AI parse it into structured resume data,
- upload a profile photo, stored via ImageKit.

## Core Features

### 1) Landing Experience
- Marketing homepage with modular sections:
  - Banner
  - Hero
  - Feature highlights
  - Testimonials
  - CTA
  - Footer

### 2) Authentication System
- Register user (name, email, password).
- Login user (email, password).
- JWT issuance with expiration.
- Protected route support via middleware (accepts both a raw JWT and a `Bearer `-prefixed token).

### 3) Dashboard Workspace
- Create resume action.
- Upload existing resume action (PDF text extracted client-side, then parsed into structured data by AI).
- Resume card listing with updated date and section-completion summary.
- Edit-title action modal.
- Delete resume action with confirmation.

### 4) Resume Builder (Guided Form Wizard)
- Section-based editing flow with progress indication:
  - Personal Info
  - Professional Summary
  - Experience
  - Education
  - Projects
  - Skills
- Next/Previous section navigation.
- AI "Enhance" actions for the professional summary and each experience description.
- Template selection.
- Accent color customization.
- Resume visibility toggle (public/private).
- Native share action for public resume URL.
- Print/download action.
- Live preview panel.

### 5) Resume Preview and Public View
- Dedicated preview routes:
  - app-scoped preview (`/app/view/:resumeId`)
  - public preview route (`/view/:resumeId`)
- Graceful "resume not found" fallback state.

### 6) AI-Assisted Content (Gemini)
- Enhance professional summary text.
- Enhance a single experience entry's job description.
- Parse a pasted/extracted resume text blob into a structured resume document.
- Automatic fallback across a configurable list of Gemini models if the primary model is unavailable or rate-limited.

### 7) Resume Backend Operations (Controller Layer)
- Create resume
- Delete resume
- Get resume by ID (owner only)
- Get public resume by ID (no auth required)
- Update resume (text fields + optional profile image upload)
- Get all resumes for authenticated user

### 8) Data Model Design
- Nested and structured resume schema:
  - personal info object (including profile image URL)
  - summary
  - skills array
  - experience array
  - projects array
  - education array
  - template + accent metadata
  - visibility flag

## Tech Stack

### Frontend
- React 19
- Vite 8
- React Router DOM
- Redux Toolkit + React Redux (auth state)
- Tailwind CSS 4
- Lucide React icons
- axios
- react-hot-toast
- react-pdftotext (client-side PDF text extraction)

### Backend
- Node.js (ESM)
- Express 5
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcrypt
- multer (in-memory storage, forwarded to ImageKit)
- CORS
- dotenv
- @google/generative-ai (Gemini)
- @imagekit/nodejs (profile image storage)

## Monorepo Structure (Detailed)

```text
resume_builder/
├─ client/
│  ├─ .gitignore
│  ├─ eslint.config.js                    # Frontend lint configuration
│  ├─ index.html                          # Vite HTML entry
│  ├─ package.json                        # Frontend scripts and dependencies
│  ├─ vite.config.js                      # Vite bundler config
│  ├─ public/
│  │  ├─ favicon.ico
│  │  ├─ favicon.svg
│  │  ├─ icons.svg
│  │  └─ logo.svg
│  └─ src/
│     ├─ main.jsx                         # React app bootstrap
│     ├─ App.jsx                          # Route definitions + session bootstrap
│     ├─ index.css                        # Global styles
│     ├─ app/
│     │  ├─ store.js                      # Redux store
│     │  └─ features/authSlice.js         # Auth state (token/user/loading)
│     ├─ configs/
│     │  └─ api.js                        # Shared axios instance (env-driven base URL)
│     ├─ assets/
│     │  ├─ assets.js                     # Dummy data source + sample profiles
│     │  ├─ dummy_profile.png
│     │  ├─ favicon.ico
│     │  └─ logo.svg
│     ├─ pages/
│     │  ├─ Home.jsx                      # Landing page composition
│     │  ├─ Login.jsx                     # Login/register UI (rendered inline by Layout)
│     │  ├─ Layout.jsx                    # App shell + navbar + outlet
│     │  ├─ Dashboard.jsx                 # Resume list and management actions
│     │  ├─ ResumeBuilder.jsx             # Full resume editing workspace
│     │  └─ Preview.jsx                   # Resume preview/public view rendering
│     └─ components/
│        ├─ navbar.jsx                    # Application navbar
│        ├─ Loader.jsx                    # Loading component
│        ├─ ResumePreview.jsx             # Common resume render entry
│        ├─ TemplateSelector.jsx          # Template switch UI
│        ├─ ColorPicker.jsx               # Accent color chooser
│        ├─ PersonalInfoForm.jsx          # Personal details form (incl. image upload)
│        ├─ ProfessionalSummary.jsx       # Summary editor + AI enhance
│        ├─ ExperienceForm.jsx            # Experience editor + AI enhance
│        ├─ EducationForm.jsx             # Education editor
│        ├─ ProjectForm.jsx               # Project editor
│        ├─ SkillsForm.jsx                # Skills editor
│        ├─ home/
│        │  ├─ Banner.jsx
│        │  ├─ Hero.jsx
│        │  ├─ Features.jsx
│        │  ├─ testimonial.jsx
│        │  ├─ cta.jsx
│        │  ├─ footer.jsx
│        │  └─ Title.jsx
│        └─ templates/
│           ├─ ClassicTemplate.jsx
│           ├─ MinimalTemplate.jsx
│           ├─ MinimalImageTemplate.jsx
│           └─ ModernTemplate.jsx
│
└─ server/
   ├─ .env.example                        # Placeholder env values (copy to .env)
   ├─ package.json                        # Backend scripts and dependencies
   ├─ server.js                           # API bootstrapping + middleware + route mount
   ├─ configs/
   │  ├─ db.js                            # MongoDB connection setup
   │  ├─ ai.js                            # Gemini client + model fallback list
   │  ├─ imageKit.js                      # ImageKit client
   │  └─ multer.js                        # Upload middleware (in-memory storage)
   ├─ middlewares/
   │  └─ authMiddleware.js                # JWT auth guard
   ├─ models/
   │  ├─ User.js                          # User schema + password compare method
   │  └─ Resume.js                        # Resume schema (nested sections)
   ├─ controllers/
   │  ├─ userController.js                # Register/login/user profile/user resumes
   │  ├─ resumeController.js              # Create/update/delete/get/public-get operations
   │  └─ aiController.js                  # AI enhance + resume-from-text upload
   ├─ services/
   │  └─ aiService.js                     # Gemini call wrapper with model fallback + JSON parsing
   └─ routes/
      ├─ userRoutes.js                    # User-auth and user-data routes
      ├─ resumeRoutes.js                  # Resume CRUD + public preview routes
      └─ aiRoutes.js                      # AI enhance + upload-resume routes
```

## Application Flow

### Frontend Route Map
- `/` -> Home page
- `/app` -> Dashboard (inside `Layout`; renders `Login` inline instead when unauthenticated)
- `/app/builder/:resumeId` -> Resume builder workspace
- `/app/view/:resumeId` -> Preview from app context (falls back to the public endpoint if not the owner)
- `/view/:resumeId` -> Public preview route

There is no standalone `/login` route. `Layout` conditionally renders the `Login` page in place when there is no authenticated user; the "Get started"/"Login" links on the homepage point at `/app` with a `?state=register` or `?state=login` query param that `Login.jsx` reads.

### Backend Route Map
Mounted base paths:
- `/api/users`
- `/api/resumes`
- `/api/ai`

User routes:
- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/data` (protected)
- `GET /api/users/resumes` (protected)

Resume routes:
- `POST /api/resumes/create` (protected)
- `PUT /api/resumes/update` (protected, accepts multipart form data with an optional `image` file)
- `DELETE /api/resumes/delete/:resumeId` (protected)
- `GET /api/resumes/get/:resumeId` (protected, owner only)
- `GET /api/resumes/public/:resumeId` (public, no auth required)

AI routes:
- `POST /api/ai/enhance-pro-sum` (protected)
- `POST /api/ai/enhance-job-desc` (protected)
- `POST /api/ai/upload-resume` (protected)

## API Documentation

### Auth + User

#### Register User
- Method: `POST`
- Path: `/api/users/register`
- Body:
```json
{
  "name": "Your Name",
  "email": "you@example.com",
  "password": "StrongPassword123"
}
```
- Response (success):
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "name": "Your Name",
    "email": "you@example.com"
  },
  "token": "<jwt-token>"
}
```

#### Login User
- Method: `POST`
- Path: `/api/users/login`
- Body:
```json
{
  "email": "you@example.com",
  "password": "StrongPassword123"
}
```
- Response (success):
```json
{
  "message": "Login successful",
  "user": {
    "_id": "...",
    "name": "Your Name",
    "email": "you@example.com"
  },
  "token": "<jwt-token>"
}
```

#### Get Authenticated User Profile
- Method: `GET`
- Path: `/api/users/data`
- Headers:
```http
Authorization: Bearer <jwt-token>
```

#### Get Authenticated User Resumes
- Method: `GET`
- Path: `/api/users/resumes`
- Headers:
```http
Authorization: Bearer <jwt-token>
```

### Resume Operations
All protected resume routes accept either a raw JWT or a `Bearer `-prefixed JWT in the `Authorization` header; new integrations should use the `Bearer ` prefix.

- `POST /api/resumes/create` - body: `{ "title": "My Resume" }`
- `PUT /api/resumes/update` - multipart form data: `resumeId`, `resumeData` (JSON string), optional `title`, optional `removeBackground`, optional `image` file
- `DELETE /api/resumes/delete/:resumeId`
- `GET /api/resumes/get/:resumeId` - owner only
- `GET /api/resumes/public/:resumeId` - no auth required; only returns resumes with `public: true`

### AI Operations

#### Enhance Professional Summary
- Method: `POST`
- Path: `/api/ai/enhance-pro-sum`
- Body: `{ "userContent": "<current summary text>" }`
- Response: `{ "enhancedContent": "<rewritten summary>" }`

#### Enhance Job Description
- Method: `POST`
- Path: `/api/ai/enhance-job-desc`
- Body: `{ "userContent": "<position, company, current description>" }`
- Response: `{ "enhancedContent": "<rewritten description>" }`

#### Upload Resume (AI parsing)
- Method: `POST`
- Path: `/api/ai/upload-resume`
- Body: `{ "title": "My Resume", "resumeText": "<extracted resume text>" }`
- Response: `{ "resumeId": "...", "message": "Resume uploaded successfully" }`

## Postman Collection
A ready-to-import Postman collection covering every route documented above (users, resumes, and AI) lives at [`server/postman/postman_collection.json`](server/postman/postman_collection.json).

Import it into Postman, then set the collection's `baseUrl` variable to either `http://localhost:3000` (local) or your deployed backend URL. Running "Register User" or "Login User" automatically captures the returned JWT into the collection's `token` variable, so every protected request in the collection works without manually copying tokens around.

## Data Models

### User
- `name: String`
- `email: String (unique)`
- `password: String (hashed)`
- timestamps

Method:
- `comparePassword(password)` using bcrypt

### Resume
- `userId: ObjectId -> User`
- `title: String`
- `public: Boolean`
- `template: String`
- `accent_color: String`
- `professional_summary: String`
- `skills: String[]`
- `personal_info` object (includes `image` URL)
- `experience[]`
- `project[]`
- `education[]`
- timestamps

## Environment Variables
Copy `server/.env.example` to `server/.env` and fill in real values:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net
JWT_SECRET=replace_with_a_long_random_string

GEMINI_API_KEY=your_gemini_api_key
# GOOGLE_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.6-flash
# GEMINI_FALLBACK_MODELS=gemini-flash-latest,gemini-3.5-flash,gemini-3.1-flash-lite

IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

Important:
- Never commit real credentials. `.env` is gitignored; only `.env.example` is tracked.
- Rotate any secret immediately if it is exposed.

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+
- MongoDB Atlas or local MongoDB

### 1) Install Backend Dependencies
```bash
cd server
npm install
```

### 2) Install Frontend Dependencies
```bash
cd ../client
npm install
```

### 3) Configure Environment
```bash
cd ../server
cp .env.example .env
# then fill in real values in .env
```

### 4) Start Backend
```bash
cd server
npm start
```

### 5) Start Frontend
```bash
cd client
npm run dev
```

## Run Commands

### Client
- `npm run dev` -> Start Vite dev server
- `npm run build` -> Production build
- `npm run preview` -> Preview production build
- `npm run lint` -> Lint frontend source

### Server
- `npm start` -> Start backend with node

## Security Notes
- Passwords are hashed with bcrypt before storage.
- Password hashes are not returned in successful auth responses.
- JWT protects authenticated endpoints.
- Keep `.env` secrets private and environment-scoped; only `.env.example` should ever be committed.
- Do not embed tokens, DB credentials, or private keys in frontend code.
