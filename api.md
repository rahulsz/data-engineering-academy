# DataEngineering.Academy API Documentation

This document serves as a futuristic tracking reference for all backend API routes and dynamic page routes implemented in the `DataEngineering.Academy` platform.

## 1. Page Routes (App Router)

### Marketing & Auth
- `/` - Landing Page
- `/sign-in` - Clerk Auth
- `/sign-up` - Clerk Auth

### Dashboard & Profile
- `/dashboard` - User Dashboard (Requires Auth). Shows XP, Streak, Recent Activity, and recommended modules.
- `/profile` - User Profile Management. View XP stats and edit profile details via Zod/React Hook Form.

### Learning System (Dynamic Routes)
- `/learn` - Course Catalog. Lists all available courses (SQL, Python, etc.) with search, sort, and filters.
- `/learn/[module]` - Module Page. Displays the lesson roadmap (timeline) for a specific module (e.g., `/learn/sql`).
- `/learn/[module]/[lesson]` - Interactive Lesson Page. Displays MDX content, visualizers, and completion logic.

### Practice Environments
- `/playground/sql` - Embedded WASM SQL Editor (PGlite) for freestyle query practice.
- `/playground/python` - Embedded Pyodide Python Editor for freestyle scripting practice.
- `/practice` - Hub for Interview Questions, Flashcards, and interactive Practice Challenges.

---

## 2. API Routes (REST endpoints)

All API routes are located in `src/app/api/`.

### Challenges
- **`GET /api/challenges`**
  - Fetches the list of coding challenges.
  - Supports query params: `?difficulty=beginner` or `?category=Select`
- **`POST /api/challenges/[id]/check`**
  - Validates a user's SQL query submission against a hidden expected output.
  - Body: `{ query: string }`
  - Returns: `{ success: boolean, results: any[], xpEarned?: number }`
  - Triggers XP awarding and Streak logic if successful.

### Flashcards
- **`GET /api/flashcards/[moduleSlug]`**
  - Fetches flashcards associated with a specific module (e.g., `sql`).

### Interview Questions
- **`GET /api/interview-questions`**
  - Fetches the bank of theoretical data engineering interview questions.
  - Used in the Practice section.

### Quiz Engine
- **`GET /api/quiz/[quizId]`**
  - Fetches a quiz payload (without exposing the correct answers directly to the client).
- **`POST /api/quiz/submit`**
  - Submits a user's quiz answers for server-side evaluation.
  - Body: `{ quizId: string, answers: Record<string, string> }`
  - Returns: `{ score: number, xpEarned: number, passed: boolean }`
  - Triggers XP awarding.

### SQL Execution Engine
- **`POST /api/sql/run`**
  - (Optional server-side runner if client-side WASM fails, or used for secure grading)
  - Evaluates SQL queries against a seeded temporary database.

### Webhooks
- **`POST /api/webhooks/clerk`**
  - Listens for Clerk `user.created`, `user.updated`, and `user.deleted` events.
  - Synchronizes Clerk users into the MongoDB `User` collection.
  - Critical for maintaining DB referential integrity without manual syncs.

---

## 3. Server Actions (RPCs)

Located in `src/features/*/actions`. These bypass traditional REST APIs and are invoked directly from Client Components.

### User & Progress (`src/features/dashboard/actions`)
- `updateProfile(data: any)` - Updates user profile details.

### Learning (`src/features/learn/actions`)
- `markLessonComplete(lessonId)` - Marks a lesson as completed, awards XP, and checks achievements.
- `bookmarkLesson(lessonId)` - Toggles bookmark state for a specific lesson.

---

## Data Models (Mongoose)
The platform uses the following strictly-typed Mongoose models, registered via Cold-Start in all API routes to prevent Serverless connection errors:
- `User`, `Progress`, `Lesson`, `Module`, `Bookmark`, `Course`, `Quiz`, `QuizAttempt`, `Achievement`, `Roadmap`, `Flashcard`, `Challenge`, `InterviewQuestion`.
