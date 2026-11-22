# Jobify - Job Portal Web Application

Jobify is a modern, responsive Job Portal application built with **React 19**, **Vite**, and **SCSS**, featuring comprehensive portals for both job seekers and administrators.

---

## 🚀 Features

### 👤 Job Seeker Features
- **Job Discovery & Search**: Filter and browse job listings by title, company, location, and type.
- **Job Details & Application**: View in-depth job descriptions, requirements, and apply directly via application modal.
- **Application Tracking**: Track status of submitted applications (Applied, In Review, Shortlisted, Rejected).
- **Saved Jobs**: Bookmark jobs to view or apply later.
- **Company Profiles**: Explore company details, openings, and company culture.
- **User Authentication**: Secure register and login flows with role-based routing.
- **Notifications**: Real-time notifications for application status updates.

### 🛠️ Admin Portal
- **Dashboard & Analytics**: Interactive charts and analytics powered by Recharts.
- **Job Management**: Create, edit, and manage job postings.
- **Application Review**: Review candidate applications and update status.
- **User Management**: Oversee registered users and permissions.
- **Settings**: Administrative configuration and preferences.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router v7
- **Styling**: SCSS (Sass)
- **Icons & Visuals**: React Icons, Recharts
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Mock Database**: JSON Server (`db.json`)

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SathishKuraku/jobify.git
   cd jobify
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the mock backend server (JSON Server):
   ```bash
   npx json-server --watch db.json --port 5000
   ```

4. In a separate terminal, start the Vite development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

---

## 📜 Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the project for production.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint for code analysis.
