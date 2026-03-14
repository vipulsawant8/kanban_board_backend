# Kanban Backend

This project is a simple Kanban task management backend API built with
Node.js, Express, and MongoDB. It allows users to create lists and add
tasks inside those lists.

The idea is similar to tools like a Kanban board where tasks are
organized in different columns such as Todo, Doing, and Done.

This project is mainly for learning how to build a REST API with
authentication and a database.

# What This Backend Does

Users can:

-   Register an account
-   Log in to get access to the API
-   Create lists (like Todo, In Progress, Done)
-   Add tasks inside lists
-   Edit tasks
-   Move tasks between lists
-   Delete lists or tasks

Each user only sees their own lists and tasks.

# Tech Stack

The backend is built with the following tools:

-   Node.js -- JavaScript runtime
-   Express -- Web framework
-   MongoDB -- Database
-   Mongoose -- MongoDB ODM
-   JWT -- Authentication
-   Zod -- Request validation
-   Pino -- Logging
-   Swagger -- API documentation
-   Jest + Supertest -- Testing

# API Base URL

/api/v1

# Authentication Routes

Register a new user
```
POST /api/v1/auth/register
```
Login
```
POST /api/v1/auth/login
```
After login, the API returns a JWT token which must be used for
protected routes.

# Lists Routes

Create a list
```
POST /api/v1/lists
```
Get all lists for the logged-in user
```
GET /api/v1/lists
```
Update a list
```
PATCH /api/v1/lists/:id
```
Delete a list
```
DELETE /api/v1/lists/:id
```
Reorder list
```
PATCH /api/v1/lists/reorder
```
# Tasks Routes

Create a task
```
POST /api/v1/tasks
```
Get tasks
```
GET /api/v1/tasks
```
Update a task
```
PATCH /api/v1/tasks/:id
```
Delete a task
```
DELETE /api/v1/tasks/:id
```
Reorder task
```
PATCH /api/v1/tasks/reorder
```
Tasks belong to a specific list.

# Security Features

Some basic security features are included:

-   JWT authentication
-   Protected routes
-   Request validation
-   Rate limiting
-   Secure headers using Helmet

These help make sure users can only access their own data.

# Environment Variables

Create a `.env` file in the root folder & copy variables from .env, .env.example with your values .


# Running the Project

Install dependencies
```
npm install
```
Run the development server
```
npm run dev
```
Run tests
```
npm test
```
Start production server
```
npm start
```
# API Documentation

Swagger documentation is available for testing the API.

Once the server is running, open:
```
/api-docs
```
in your browser.

# Notes

This project was built for learning purposes to practice:

-   REST API design
-   Authentication with JWT
-   MongoDB with Mongoose
-   Express middleware
-   API testing

# License

MIT License
