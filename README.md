# DPS Backend Coding Challenge

A RESTful API for managing projects and reports built with Node.js, Express.js, and TypeScript.

## 🚀 Features

- **REST API Development**: Full CRUD operations for projects and reports
- **Special API Endpoint**: Special endpoint to find reports with repeated words (3+ occurrences)
- **Authentication**: Bearer token security (`Password123`)
- **Data Integrity**: Cascade delete for project-report relationships
- **Type Safety**: Full TypeScript implementation
- **Testing**: Comprehensive unit test suite

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite3
- **Testing**: Jest with ts-jest
- **Code Quality**: ESLint + Prettier

## 📋 API Endpoints

### Public
- `GET /` - API documentation
- `GET /health` - Health check

### Projects (Auth Required)
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Reports (Auth Required)
- `GET /api/reports` - List all reports
- `POST /api/reports` - Create report
- `GET /api/reports/:id` - Get report by ID
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report
- `GET /api/reports/word-count` - Word analysis endpoint

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd dps-expressjs-challenge
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

## 🔑 Authentication

All API endpoints require Bearer token authentication:

```bash
curl -H "Authorization: Bearer Password123" http://localhost:3000/api/projects
```

## 📊 Testing

- **Unit Tests**: Comprehensive service layer tests
- **Coverage**: High coverage on business logic
- **Framework**: Jest with TypeScript support

```bash
npm test              # Run all tests
npm run test:coverage # Run with coverage report
npm run test:watch    # Watch mode for development
```

## 🗄️ Database Schema

![Database schema](images/database_schema.png)

## 📝 Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm test          # Run unit tests
npm run lint      # Check code quality
npm run format    # Fix code formatting
```

---
Built with ❤️ using Node.js, Express.js, and TypeScript