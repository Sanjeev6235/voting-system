# 🗳️ VoteSecure — Online Voting System

A full-stack **MERN** (MongoDB, Express, React, Node.js) Online Voting System with JWT authentication, role-based access control, real-time results, and a premium UI built with Tailwind CSS.

> ✅ Suitable for final-year college projects and GitHub portfolios.

---

## 📸 Features

| Feature | Details |
|---------|---------|
| 🔐 Authentication | JWT-based login/signup, bcrypt password hashing |
| 👑 Admin Panel | Create/edit/delete elections & candidates, manage voters, start/end elections |
| 🗳️ Voter Panel | Browse elections, cast votes, view results |
| 🔒 One-Vote Enforcement | MongoDB compound index + API-level duplicate prevention |
| 📊 Results Dashboard | Live bar/pie charts with candidate rankings and percentage |
| 🌙 Dark Mode | System-aware dark/light theme toggle |
| 📱 Responsive | Mobile, tablet, and desktop layouts |
| 🔔 Notifications | React Hot Toast for success/error feedback |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

### 1. Clone & Setup

```bash
git clone https://github.com/Sanjeev6235/voting-system.git
cd voting-system
```

---

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env and fill in your values:
# MONGODB_URI=mongodb://localhost:27017/voting_system
# JWT_SECRET=your_super_secret_key_here
# PORT=5000
```

#### Seed demo data (optional but recommended)
```bash
node seed.js
```
This creates:
- **Admin:** `admin@vote.com` / `admin123`
- **Voter 1:** `alice@vote.com` / `voter123`
- **Voter 2:** `bob@vote.com` / `voter123`
- 2 sample elections with candidates

#### Start the backend server
```bash
npm run dev     # development (with nodemon)
# or
npm start       # production
```
Server runs on **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```
App runs on **http://localhost:3000**

> The Vite dev server proxies `/api` requests to `http://localhost:5000` automatically.

---

## 📁 Project Structure

```
voting-system/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Register, Login
│   │   ├── userController.js  # Profile, Change Password, Voters list
│   │   ├── electionController.js
│   │   ├── candidateController.js
│   │   ├── voteController.js  # Cast vote, check vote status
│   │   └── resultController.js# Results, dashboard stats
│   ├── middleware/
│   │   └── authMiddleware.js  # protect, adminOnly
│   ├── models/
│   │   ├── User.js
│   │   ├── Election.js
│   │   ├── Candidate.js
│   │   └── Vote.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── electionRoutes.js
│   │   ├── candidateRoutes.js
│   │   ├── voteRoutes.js
│   │   └── resultRoutes.js
│   ├── seed.js                # Demo data seeder
│   ├── server.js              # Express entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Loader.jsx
    │   │   ├── Modal.jsx
    │   │   ├── ConfirmModal.jsx
    │   │   ├── ElectionCard.jsx
    │   │   ├── CandidateCard.jsx
    │   │   ├── ResultChart.jsx
    │   │   ├── StatCard.jsx
    │   │   └── EmptyState.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx  # Global auth state
    │   │   └── ThemeContext.jsx # Dark/light mode
    │   ├── pages/
    │   │   ├── Home.jsx         # Landing page
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── VoterDashboard.jsx
    │   │   ├── Elections.jsx    # Browse & filter
    │   │   ├── ElectionDetail.jsx # Vote + candidate CRUD
    │   │   ├── Results.jsx      # Charts & winner
    │   │   ├── Profile.jsx
    │   │   └── ManageVoters.jsx
    │   ├── services/
    │   │   └── api.js           # Axios instance + interceptors
    │   ├── App.jsx              # Routes & guards
    │   ├── main.jsx
    │   └── index.css            # Tailwind + custom styles
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login |

### User
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/user/profile` | Private | Get own profile |
| PUT | `/api/user/profile` | Private | Update profile |
| PUT | `/api/user/change-password` | Private | Change password |
| GET | `/api/user/voters` | Admin | List all voters |
| DELETE | `/api/user/:id` | Admin | Delete voter |

### Elections
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/elections` | Public | All elections |
| GET | `/api/elections/:id` | Public | Single election |
| POST | `/api/elections` | Admin | Create election |
| PUT | `/api/elections/:id` | Admin | Update election |
| PUT | `/api/elections/:id/status` | Admin | Change status |
| DELETE | `/api/elections/:id` | Admin | Delete election + cascade |

### Candidates
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/candidates/:electionId` | Public | Candidates for election |
| GET | `/api/candidates/single/:id` | Public | Single candidate |
| POST | `/api/candidates` | Admin | Add candidate |
| PUT | `/api/candidates/:id` | Admin | Update candidate |
| DELETE | `/api/candidates/:id` | Admin | Delete candidate |

### Votes & Results
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/votes` | Private | Cast a vote |
| GET | `/api/votes/check/:electionId` | Private | Check if voted |
| GET | `/api/results/:electionId` | Public | Election results |
| GET | `/api/results/stats/dashboard` | Admin | Dashboard stats |

---

## 🔐 Security Measures

- **bcryptjs** — passwords hashed with salt rounds of 10
- **JWT** — stateless authentication with configurable expiry
- **Compound Index** — MongoDB enforces one vote per user per election at DB level
- **Role Middleware** — `adminOnly` guard on all sensitive routes
- **Input Validation** — `express-validator` on auth routes
- **Cascade Delete** — deleting an election removes all its candidates and votes

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS 3 |
| State | React Context API + Hooks |
| HTTP | Axios |
| Charts | Chart.js + react-chartjs-2 |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Routing | React Router DOM v6 |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |

---

## 🌐 Deployment

### Backend (Railway / Render / Heroku)
1. Set environment variables: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`
2. Deploy the `/backend` folder
3. Update `frontend/vite.config.js` proxy target OR set `VITE_API_URL` in frontend env

### Frontend (Vercel / Netlify)
1. Build: `npm run build` inside `/frontend`
2. Deploy the `dist/` folder
3. Set `VITE_API_URL=https://your-backend.com` in environment variables

---

## 👥 Default Test Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@vote.com | admin123 |
| Voter | alice@vote.com | voter123 |
| Voter | bob@vote.com | voter123 |

---

## 📝 License
MIT — Free for academic and personal use.
