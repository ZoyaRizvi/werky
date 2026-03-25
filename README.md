# Werkee

**A job platform built for teen freelancers.** Werkee connects young talent with recruiters through AI-powered skill assessments, real-time messaging, and a role-based dashboard ecosystem — all backed by Firebase and Google's Generative AI.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Firebase Setup](#firebase-setup)
- [Data Models](#data-models)
- [Skill Assessment Flow](#skill-assessment-flow)
- [Routes](#routes)
- [Deployment](#deployment)

---

## Overview

Werkee is a full-featured freelancing platform targeting teenagers looking to enter the workforce. The platform solves the credentialing problem — teens often lack work history, so Werkee lets them earn verified skill badges through AI-generated assessments that live on their profile. Recruiters can then browse talent by verified skill, post projects, send offers, and manage everything from a dedicated dashboard.

**Three user roles:**
- **Candidate** — Freelancers who browse jobs, take assessments, earn badges, and communicate with recruiters
- **Recruiter** — Post projects, discover freelancers by verified skill, send offers, and manage orders
- **Admin** — Manage platform users and view analytics

---

## Features

### Candidates (Freelancers)

| Feature | Description |
|---|---|
| **Job Discovery** | Browse and search open projects posted by recruiters, filterable by category and budget |
| **Skill Assessments** | AI-generated quizzes across 8+ skill categories at 4 difficulty levels (Entry, Basic, Intermediate, Advanced) |
| **Badges** | Pass an assessment (score ≥ 8/10) to earn a verified skill badge added to your Firestore profile |
| **Profile & Portfolio** | Showcase badges, skills, bio, location, and social links |
| **Real-time Chat** | Instant messaging with recruiters via Firestore listeners |
| **AI Counsellor** | Career guidance chatbot powered by Google Generative AI |
| **Orders & Offers** | Track incoming project offers, accept or decline, and manage active orders |
| **Notifications** | Real-time feed of job activity and offer updates |

### Recruiters

| Feature | Description |
|---|---|
| **Post Projects** | Create and manage job or project listings with budgets and descriptions |
| **Browse Freelancers** | Search talent by skill with verified badge indicators |
| **Send Offers** | Send project offers directly to candidates |
| **Orders Management** | Track proposal responses and manage ongoing work |
| **Real-time Chat** | Direct messaging with candidates |
| **Payments** | Handle payment flow for completed projects |

### Admin

- View platform analytics (user counts, job stats) via Chart.js and ApexCharts dashboards
- Manage (view/delete) registered freelancers and recruiters

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18.2 |
| **Build Tool** | Vite 4.5 |
| **Styling** | Tailwind CSS 3.3, Material Tailwind 2.1, MUI 5.16 |
| **Routing** | React Router v6.17 |
| **State Management** | React Context API (auth state), Redux 5 + Redux Thunk 3 |
| **Backend / Database** | Firebase 10 — Firestore, Auth, Storage |
| **AI — Assessments** | Google Generative AI SDK 0.15 (via external API `werkee-backend.onrender.com`) |
| **AI — Counsellor** | Google Generative AI SDK (in-client chatbot) |
| **Charts** | ApexCharts 3.44, Chart.js 4.4 |
| **HTTP Client** | Axios 1.7 |
| **Notifications** | react-toastify 11 |
| **Icons** | React Icons 5.2, Heroicons 2.1 |
| **Markdown Rendering** | react-markdown 9 |
| **Animation** | AOS (Animate On Scroll) |
| **Linting / Formatting** | ESLint, Prettier (with Tailwind class sorting) |

---

## Project Structure

```
werkee/
├── public/
│   └── img/                        # Static images and logos
├── src/
│   ├── assets/                     # App-level assets
│   ├── configs/                    # App configuration constants
│   ├── context/
│   │   ├── authContext/            # Firebase auth context + useAuth() hook
│   │   └── index.jsx               # Material Tailwind UI controller context
│   ├── firebase/
│   │   ├── firebase.js             # Firebase app initialization
│   │   └── auth.js                 # Auth helper methods (sign in, sign up, Google OAuth, etc.)
│   ├── layouts/
│   │   ├── landing/                # 13 public landing page section components
│   │   ├── dashboard.jsx           # Recruiter/admin dashboard shell (sidenav + navbar)
│   │   └── auth.jsx                # Auth pages shell
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── sign-in.jsx         # Email/password login
│   │   │   └── sign-up.jsx         # Registration with role selection
│   │   ├── candidate/
│   │   │   ├── home.jsx            # Job discovery feed
│   │   │   ├── profile.jsx         # Candidate profile with badge management
│   │   │   ├── chat.jsx            # Real-time messaging
│   │   │   ├── counsellor.jsx      # AI career counselling chatbot
│   │   │   ├── skillassessment.jsx # Full assessment flow (level → skill → quiz → result)
│   │   │   ├── Orders.jsx          # Incoming offers and active orders
│   │   │   ├── Jobs.jsx            # Job listings browser
│   │   │   ├── notifications.jsx   # Notification feed
│   │   │   └── RecruiterProfile.jsx
│   │   ├── dashboard/
│   │   │   ├── home.jsx            # Recruiter dashboard (stats, recent activity)
│   │   │   ├── profile.jsx         # Recruiter profile management
│   │   │   ├── chat.jsx            # Chat with freelancers
│   │   │   ├── Orders.jsx          # Orders and offer tracking
│   │   │   ├── Responses.jsx       # Responses to job postings
│   │   │   ├── Jobs.jsx            # Create and manage job listings
│   │   │   ├── PaymentModal.jsx    # Payment handling
│   │   │   ├── notifications.jsx
│   │   │   └── FreelancerProfile.jsx
│   │   └── admin/
│   │       ├── home.jsx            # Admin analytics dashboard
│   │       ├── Freelancers.jsx     # Freelancer management
│   │       └── Recruiters.jsx      # Recruiter management
│   ├── widgets/
│   │   ├── cards/                  # statistics-card, message-card, profile-info-card
│   │   ├── charts/                 # statistics-chart wrapper
│   │   └── layout/
│   │       ├── sidenav.jsx         # Role-based dynamic sidebar
│   │       ├── dashboard-navbar.jsx
│   │       └── navbar.jsx          # Public pages navbar
│   ├── data/                       # Static/mock data for charts and UI
│   ├── routes.jsx                  # All route definitions
│   ├── sideNavRoutes.jsx           # Role-based sidenav route config
│   ├── App.jsx                     # Root component
│   └── main.jsx                    # React entry point
├── .firebaserc                     # Firebase project alias
├── firebase.json                   # Firebase hosting config
├── tailwind.config.cjs
├── vite.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** 9 or higher
- A **Firebase project** with the following enabled:
  - Firestore Database
  - Authentication (Email/Password + optionally Google)
  - Storage

### Installation

```bash
git clone https://github.com/your-username/werkee.git
cd werkee
npm install
```

### Firebase Configuration

Open [src/firebase/firebase.js](src/firebase/firebase.js) and replace the config object with your own Firebase project credentials:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};
```

> **Note:** The credentials are currently hardcoded. For production, move them into a `.env` file using Vite's `import.meta.env.VITE_*` pattern and add `.env` to `.gitignore`.

### Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Building for Production

```bash
npm run build      # Outputs to dist/
npm run preview    # Preview the production build locally
```

---

## Firebase Setup

### Firestore Security Rules

Make sure your Firestore rules allow authenticated reads/writes to the relevant collections. At minimum you need:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == uid;
    }
    match /Offers/{id} {
      allow read, write: if request.auth != null;
    }
    match /orders/{id} {
      allow read, write: if request.auth != null;
    }
    match /messages/{id} {
      allow read, write: if request.auth != null;
    }
    match /notifications/{id} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Firestore Indexes

Real-time chat queries filter by the `users` array field and order by `timestamp`. Create a composite index on the `messages` collection:

| Collection | Fields | Query scope |
|---|---|---|
| `messages` | `users` (Array) + `timestamp` (Ascending) | Collection |

---

## Data Models

### `users/{uid}`
```
uid            string
email          string
displayName    string
role           "candidate" | "recruiter" | "admin"
title          string       — profession or role title
info           string       — bio
location       string
profileImage   string       — Storage URL
coverPhoto     string       — Storage URL
skills         string[]     — skill names
badges         object[]     — [{ skill, level, earnedAt }]
facebook       string
twitter        string
instagram      string
createdAt      Timestamp
```

### `Offers/{offerId}`
```
id                string
RecruiterEmail    string
FreelancerEmail   string
title             string
description       string
budget            number
status            string
timestamp         Timestamp
```

### `orders/{orderId}`
```
id                string
RecruiterEmail    string
FreelancerEmail   string
status            "Accepted" | "In Progress" | "Completed"
timestamp         Timestamp
```

### `messages/{messageId}`
```
from       string      — sender email
to         string      — recipient email
users      string[]    — [from, to] (used for querying conversations)
text       string
timestamp  Timestamp
jobTitle   string?
```

### `notifications/{notificationId}`
```
Email      string      — recipient
message    string
offerId    string
seen       boolean
timestamp  Timestamp
```

### `assessment/{assessmentId}`
```
id              string
skill           string
level           string
quizData        object    — questions and correct answers
candidateEmail  string
timestamp       Timestamp
```

### Sub-collections (under recruiter user documents)
- `users/{recruiterId}/jobs/{jobId}` — job postings
- `users/{recruiterId}/projects/{projectId}` — project listings

---

## Skill Assessment Flow

Candidates earn verifiable skill badges through a structured AI-powered assessment:

1. **Select Difficulty** — Choose from Entry, Basic, Intermediate, or Advanced
2. **Select Skill** — Pick from 8+ categories:
   - Project Management, DevOps, Content Writing, Video Editing, Marketing, Technical Writing, SQA, Graphic Designing
3. **Generate Quiz** — The app calls `POST https://werkee-backend.onrender.com/api/assessment` with `{ skill, level }`. The backend uses Google Generative AI to generate 10 unique questions
4. **Take the Quiz** — Candidate answers all questions within the session
5. **Result** — Score ≥ 8/10 = Pass. On passing, a badge object is written to the candidate's `badges` array in Firestore and immediately reflected on their profile

---

## Routes

### Public

| Path | Description |
|---|---|
| `/` | Landing page |
| `/auth/sign-in` | Email/password login |
| `/auth/sign-up` | Registration (choose role: candidate or recruiter) |

### Candidate

| Path | Description |
|---|---|
| `/home` | Job discovery feed |
| `/profile` | Your profile and badge management |
| `/chat` | Real-time messaging with recruiters |
| `/counsellor` | AI career guidance chatbot |
| `/skillassessment` | Skill assessment flow |
| `/orders` | Incoming offers and active orders |
| `/jobs` | Browse all posted jobs |
| `/notifications` | Notification feed |
| `/recruiterprofile` | View a recruiter's profile |

### Recruiter (Dashboard)

| Path | Description |
|---|---|
| `/dashboard/home` | Dashboard overview and stats |
| `/dashboard/profile` | Recruiter profile settings |
| `/dashboard/chat` | Chat with freelancers |
| `/dashboard/orders` | Manage orders and track responses |
| `/dashboard/jobs` | Create and manage job/project listings |
| `/dashboard/notifications` | Notification feed |
| `/dashboard/freelancerprofile` | View a freelancer's profile |

### Admin

| Path | Description |
|---|---|
| `/admin/home` | Analytics overview (charts and counters) |
| `/admin/freelancers` | Manage freelancer accounts |
| `/admin/recruiters` | Manage recruiter accounts |

---

## Deployment

### Firebase Hosting

```bash
npm run build
firebase login
firebase deploy
```

The `firebase.json` config points the hosting public directory to `public/`. Make sure your production build output is correctly referenced.

### Other Static Hosts

The `dist/` folder produced by `npm run build` is a standard static site and can be deployed to Vercel, Netlify, or any static host. Ensure your host is configured to redirect all routes to `index.html` for client-side routing to work correctly.

---

## Version

`v2.1.0`
