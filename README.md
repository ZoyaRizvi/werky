# Werkee

A job platform connecting teen freelancers with recruiters. Werkee lets candidates discover projects, get AI-powered skill assessments, earn badges, and communicate with recruiters — all in one place.

---

## Features

### For Candidates (Freelancers)
- **Job Discovery** — Browse and search open projects posted by recruiters, filtered by category and budget
- **Skill Assessments** — AI-generated quizzes across skills (Graphic Design, Content Writing, DevOps, Marketing, and more) at multiple levels (Entry, Basic, Intermediate, Advanced). Pass to earn a badge on your profile
- **Profile & Badges** — Showcase earned skill badges and work history
- **Chat** — Real-time messaging with recruiters
- **Counselling** — Career guidance and mentorship resources
- **Notifications** — Stay updated on job activity

### For Recruiters (Dashboard)
- **Post Projects** — Create and manage job/project listings
- **Browse Freelancers** — View freelancer profiles and their verified skill badges
- **Orders & Responses** — Track proposals and manage ongoing orders
- **Chat** — Communicate directly with candidates
- **Payments** — Handle payment flow for completed work

### Admin
- Manage registered freelancers and recruiters

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Styling | Tailwind CSS, Material Tailwind, MUI |
| State Management | Redux + Redux Thunk |
| Backend / Database | Firebase (Firestore, Auth, Storage) |
| AI | Google Generative AI (skill assessment questions) |
| Charts | ApexCharts, Chart.js |
| Routing | React Router v6 |
| HTTP | Axios |

---

## Project Structure

```
src/
├── context/            # Auth context (Firebase)
├── firebase/           # Firebase config & exports
├── layouts/
│   ├── landing/        # Public landing page sections
│   ├── dashboard.jsx   # Recruiter dashboard shell
│   └── auth.jsx        # Auth pages shell
├── pages/
│   ├── auth/           # Sign in / Sign up
│   ├── candidate/      # Freelancer-facing pages
│   ├── dashboard/      # Recruiter-facing pages
│   └── admin/          # Admin panel
├── widgets/            # Reusable UI components (cards, charts, navbars)
├── routes.jsx          # Route definitions
└── App.jsx             # Root component
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project (Firestore, Auth, and Storage enabled)

### Installation

```bash
git clone https://github.com/your-username/werkee.git
cd werkee
npm install
```

### Environment Setup

The Firebase config is located in [src/firebase/firebase.js](src/firebase/firebase.js). Replace the values with your own Firebase project credentials:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### Running Locally

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm run preview
```

---

## Routes

| Path | Description |
|---|---|
| `/` | Landing page |
| `/auth/sign-in` | Sign in |
| `/auth/sign-up` | Sign up |
| `/dashboard/home` | Recruiter dashboard home |
| `/dashboard/profile` | Recruiter profile |
| `/dashboard/chat` | Recruiter chat |
| `/dashboard/notifications` | Recruiter notifications |
| `/skillassessment` | Skill assessment flow |
| `/freelancerprofile` | Freelancer public profile |

---

## Skill Assessment Flow

1. Candidate selects a difficulty level (Entry → Advanced)
2. Selects a skill category
3. AI generates quiz questions via the backend API
4. Candidate submits answers — score ≥ 8/10 = Pass
5. On passing, a skill badge is added to their Firestore profile

---

## Version

`v2.1.0`
