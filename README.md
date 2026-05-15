# 💰 Budgeting Application (Backend & Frontend)

A full-stack financial management platform that helps users track spending, manage budgets, and receive AI-powered financial insights using Google's Gemini AI.

Built with a secure, scalable, and production-ready architecture using Spring Boot, React, PostgreSQL, Docker, and GitHub Actions.

---

## 📌 Overview

This project demonstrates a modern full-stack architecture focused on:

- Secure authentication using JWT + HttpOnly Cookies
- AI-powered financial recommendations
- Dockerized deployment
- CI/CD automation
- Clean layered backend architecture
- Resilient third-party API integration

---

# 🚀 Features

## 💡 AI Financial Insights
Integrated with Google Gemini AI to generate personalized financial advice based on user spending behavior and budgeting patterns.

## 🛡 Secure Authentication
- JWT Authentication
- HttpOnly Cookies
- Spring Security
- Protected API Routes
- Secure session handling against XSS attacks

## 📊 Budget Management
- Create and manage budgets
- Track expenses
- View budget summaries
- Real-time financial reporting

## ⚡ Resilient System Design
The application implements graceful degradation:

- If Gemini AI becomes unavailable, the budgeting system continues functioning normally.
- Core financial operations are never blocked by third-party service failures.

## 🐳 Dockerized Infrastructure
Entire application stack is containerized using Docker Compose:
- Backend
- Frontend
- PostgreSQL Database

## 🔄 CI/CD Automation
GitHub Actions pipeline automatically:
- Runs tests
- Builds Docker images
- Pushes versioned images to Docker Hub

---

# 🛠 Tech Stack

## Backend
- Java 21
- Spring Boot 3
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT Authentication
- Gemini AI API
- Lombok
- SLF4J Logging

## Frontend
- React
- Tailwind CSS
- Axios

## Infrastructure & DevOps
- Docker
- Docker Compose
- GitHub Actions
- Docker Hub

---

# 🏗 System Architecture

```text
Frontend (React)
       │
       ▼
Backend API (Spring Boot)
       │
 ┌───────────────┐
 │               │
 ▼               ▼
PostgreSQL    Gemini AI API
(Database)    (AI Insights)
```

---

# 📂 Project Structure

```text
budgeting-app/
│
├── backend/
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .env
└── README.md
```

---

# 🧠 Architecture Decisions

## Layered Architecture

The backend follows a layered architecture pattern:

```text
Controller → Service → Repository → Database
```

Benefits:
- Separation of concerns
- Easier testing
- Improved scalability
- Better maintainability

---

## Resilience Pattern

Gemini AI integration is wrapped with exception handling to ensure:
- AI failures do not crash the application
- Reports continue generating normally
- Users still access core budgeting features

Example:

```java
try {
    return geminiService.generateInsights(report);
} catch (Exception e) {
    log.error("Gemini AI unavailable", e);
    return "AI insights are currently unavailable.";
}
```

---

## Secure JWT Storage

JWT tokens are stored in HttpOnly Cookies instead of localStorage.

Why?
- Prevents JavaScript access to tokens
- Reduces XSS attack surface
- More production-grade security

---

# 🚦 Getting Started

## Prerequisites

Make sure you have installed:

- Docker
- Docker Compose
- Git
- Gemini API Key

---

# ⚙️ Environment Variables

Create a `.env` file in the root directory.

```env
DB_NAME=budget_app_db
DB_USER=fathia
DB_PASSWORD=password123

JWT_SECRET=your_super_secret_long_key

GEMINI_API_KEY=your_actual_gemini_key
```

---

# 📥 Installation

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/budgeting-app.git
```

## 2. Navigate Into the Project

```bash
cd budgeting-app
```

## 3. Run the Application

```bash
docker compose up --build
```

---

# 🌐 Application URLs

| Service | URL |
|---|---|
| Frontend | http://localhost |
| Backend API | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

---

# 🐳 Docker Setup

The application uses Docker Compose to orchestrate:

- Backend container
- Frontend container
- PostgreSQL container

Benefits:
- Consistent development environment
- Simplified onboarding
- Easier deployments
- Cross-platform compatibility

---

# 🔄 CI/CD Pipeline

GitHub Actions automatically handles:

## ✅ Testing
- Spins up PostgreSQL test container
- Runs Maven tests

## 🏗 Build Process
- Builds optimized Docker images
- Uses multi-stage Docker builds

## 📦 Deployment Pipeline

Images are automatically pushed to Docker Hub using version tags:

```text
v1.0.[run_number]-[commit_sha]
```

---

# 📝 Logging & Monitoring

The application uses SLF4J structured logging.

## Enable Debug Logging

```properties
logging.level.budgeting_application=DEBUG
```

## View Docker Logs

```bash
docker compose logs -f backend
```

---

# 🔐 Security Practices

Implemented security best practices include:

- HttpOnly JWT Cookies
- Password Encryption
- Secure Authentication Flows
- Input Validation
- Exception Handling
- Protected API Endpoints
- Environment Variable Management

---

# 📡 API Example

## User Login

### Request

```http
POST /api/v1/auth/login
```

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## Budget Creation

### Request

```http
POST /api/v1/budgets
```

```json
{
  "title": "Monthly Feeding",
  "amount": 50000,
  "category": "Food"
}
```

---

# 🧪 Future Improvements

Planned enhancements:
- Redis caching
- Refresh token rotation
- Email notifications
- Expense analytics dashboard
- Kubernetes deployment
- API rate limiting
- WebSocket real-time updates

---

# 🤝 Contributing

1. Fork the repository

2. Create your feature branch

```bash
git checkout -b feature/AmazingFeature
```

3. Commit your changes

```bash
git commit -m "Add AmazingFeature"
```

4. Push to GitHub

```bash
git push origin feature/AmazingFeature
```

5. Open a Pull Request

---

# 📜 License

This project is licensed under the MIT License.

---

# 👩‍💻 Author

Built by **Fathia Oyinloye**

Passionate about Backend Engineering, Scalable Systems, and AI-powered applications.