# VoteSecure — Online Voting System

![MERN](https://img.shields.io/badge/Stack-MERN-16a34a?style=flat-square)
![JWT](https://img.shields.io/badge/Auth-JWT-111827?style=flat-square&logo=jsonwebtokens)
![React](https://img.shields.io/badge/Frontend-React-61dafb?style=flat-square&logo=react)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47a248?style=flat-square&logo=mongodb)

VoteSecure is a full-stack online voting application built with MongoDB, Express, React, and Node.js. It provides separate administrator and voter workflows, election and candidate management, vote submission, and result visualisation.

## Features

### Authentication and roles
- User registration and login
- JWT-based authentication
- Password hashing with bcryptjs
- Role-protected administrator and voter areas

### Administrator
- Create, update, and delete elections
- Manage candidates
- Manage voter accounts
- Start and end elections
- View dashboard statistics

### Voter
- Browse available elections
- View election and candidate information
- Cast a vote
- Check voting status
- View election results

### Results and experience
- Candidate result charts and percentages
- One-vote-per-user-per-election protection
- Responsive layouts
- Dark/light theme support
- Toast feedback for user actions

## Technology Stack

| Layer | Tools |
| --- | --- |
| Frontend | React 18, Vite, Tailwind CSS |
| Routing | React Router |
| API requests | Axios |
| Charts | Chart.js, react-chartjs-2 |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| Validation | express-validator |

## Project Structure

- `backend/` — API, models, controllers, routes, middleware, and seed script
- `frontend/` — React application, pages, components, context, and API service

## Local Setup

### Requirements

- Node.js
- npm
- MongoDB local instance or Atlas database

### 1. Clone the repository

`git clone https://github.com/Sanjeev6235/voting-system.git`

### 2. Backend

Go to `backend/`, run `npm install`, create a `.env` file based on the project's `.env.example`, and configure the database connection, JWT secret, and server port.

Start the API with `npm run dev`. The current project documentation uses `http://localhost:5000` as the backend address.

### 3. Frontend

Go to `frontend/`, run `npm install`, then `npm run dev`. The Vite development server is configured for the frontend application.

### Optional demo data

The backend includes a seed script. Review the script before running it with `node seed.js`, especially if using a database that contains data you want to keep.

## Security Notes

- Keep environment variables and JWT secrets out of source control.
- Use a unique, strong JWT secret outside local development.
- Demo credentials, if used, should never be reused in a production deployment.
- This project is a learning/demo application and should not be used for legally binding elections without independent security, privacy, and accessibility audits.

## Author

**Sanjeev Kumar** · [GitHub](https://github.com/Sanjeev6235)

---

⭐ Contributions, issues, and suggestions are welcome.