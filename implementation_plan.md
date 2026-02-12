# Implementation Plan: Frontend Expansion

This plan outlines the roadmap to building a premium React frontend and integrating it with the existing backend.

## Phase 1: Environment & Design Foundation
- [ ] **Infrastructure**: 
    - Initialize Vite + React + TypeScript project in a `/frontend` directory.
    - Set up ESLint, Prettier, and absolute path aliasing.
- [ ] **Design System**:
    - Install Tailwind CSS and configure a custom theme (Deep Slates, Indigo accents).
    - Set up `Shadcn/UI` for high-quality accessible components.
    - Integrate `Lucide React` for a consistent icon library.
- [ ] **Animations**: Initialize `Framer Motion` for micro-interactions and page transitions.

## Phase 2: Core Logic & API Integration
- [ ] **Registration Logic**:
    - [ ] **Validation**: Replicate `registerSchema` (username, email, password) from backend using Zod.
    - [ ] **Service**: Add `authService.ts` with `register` method.
    - [ ] **UI**: Create `RegisterPage.tsx` with Glassmorphism design.
        - Inputs: Username, Email, Password.
        - Feedback: Real-time validation errors, toaster notifications for success/failure.
    - [ ] **Security**: Implement XSS protection.
        - Install `dompurify` to sanitize all user inputs before sending to API.
        - Create a utility hook/function for input sanitization.
    - [ ] **Login Logic**:
        - [ ] **Validation**: Replicate `loginSchema` (email, password) using Zod.
        - [ ] **Service**: Add `login` method to `authService.ts` handling JWT storage.
        - [ ] **UI**: Update `LoginPage.tsx` to use real form submission.
    - [ ] **Routing**: Add `/register` route and protect `/`.


## Phase 3: UI Implementation (The "Premium" Look) & Task Management
- [ ] **Auth Pages**:
    - [ ] Create a Glassmorphism-style Login and Registration interface.
    - [ ] Add real-time field validation feedback.
- [ ] **Main Dashboard**:
    - [ ] Build a "Task Desk" view with a clean, minimalist layout.
    - [ ] Implement a sidebar/header for user profile and logout.
- [ ] **Task Components** (Enhanced):
    - [ ] **TaskCard**: Feature subtle hover effects, priority badges.
    - [ ] **Task Actions**:
        - [ ] **Complete**: Clicking circle icon triggers `ConfirmationModal` ("Mark as complete? Yes/No").
        - [ ] **Edit**: Update description via modal/inline.
        - [ ] **Delete**: Button to remove task.
    - [ ] **Add Task**: 
        - [ ] Wire up "+ Add Task" button to a `CreateTaskModal` (Dialog).
- [ ] **Data Layer**:
    - [ ] Create `todoService.ts` interacting with `/api/todos`.
    - [ ] Define Zod schemas for Task creation/updates.
- [ ] **UX Polish**:
    - [ ] Add Skeleton Loaders for "instant feel" during data fetches.
    - [ ] Implement "Optimistic Updates" (tasks appear/change instantly before server responds).

## Phase 4: Full-Stack Integration & DevOps
- [ ] **Environment Context**:
    - Update backend CORS settings to allow requests from the frontend container/domain.
- [ ] **Dockerization**:
    - Create a multi-stage `Dockerfile` for the frontend (Build -> Nginx).
    - Revise root `docker-compose.yml` to include the `frontend` service.
- [ ] **Nginx Configuration**:
    - Set up Nginx as a reverse proxy to serve the frontend and route `/api/*` to the backend.

## Phase 5: Testing & Final Polish
- [ ] **Responsiveness**: Audit all views on mobile/tablet screen sizes.
- [ ] **Dark Mode**: Add a high-fidelity dark theme toggle.
- [ ] **Performance Audit**: Check bundle sizes and Lighthouse scores.
- [ ] **End-to-End Testing**: (Optional) Set up Playwright for critical path testing.
