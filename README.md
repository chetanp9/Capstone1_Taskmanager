# Task Management System

## Overview
The **Task Management System** is a web-based application that allows users to manage their tasks efficiently. It includes features like user authentication, task creation, and task management. The backend is built using Java Spring Boot, and the frontend is developed with HTML, CSS, and JavaScript.

---

## Project Structure
```
Capstone1-Task_managmemt_system/
├── Backend/
│   ├── authservice/       # Spring Boot service for authentication
│   ├── taskservice/       # Spring Boot service for task management
├── Frontend/
│   ├── index.html         # Authentication page
│   ├── dashboard.html     # Task management dashboard
│   ├── styles.css         # Styling for the application
│   ├── auth.js            # Handles authentication logic
│   ├── tasks.js           # Handles task-related logic
```

---

## Frontend

### Authentication Page (`index.html`)
The `index.html` file contains:
- **Login Form**: Allows users to log in with their credentials.
- **Registration Form**: Allows new users to register.

The frontend is served on `http://localhost:3000`.

---

## Backend

### AuthService
- **Purpose**: Handles user authentication (registration, login, and JWT token generation).
- **Port**: Runs on `http://localhost:8081`.
- **Endpoints**:
  - `POST /auth/register`: Registers a new user.
  - `POST /auth/login`: Authenticates a user and returns a JWT token.

### TaskService
- **Purpose**: Manages tasks (CRUD operations).
- **Port**: Runs on `http://localhost:8082`.
- **Endpoints**:
  - `GET /tasks`: Retrieves all tasks for the authenticated user.
  - `POST /tasks`: Creates a new task.
  - `PUT /tasks/{taskId}`: Updates an existing task.
  - `DELETE /tasks/{taskId}`: Deletes a task.

---

## Database Configuration

Both `AuthService` and `TaskService` use a PostgreSQL database. Follow these steps to configure the database:

1. **Install PostgreSQL**:
   - Download and install PostgreSQL from [https://www.postgresql.org/download/](https://www.postgresql.org/download/).

2. **Create Databases**:
   - Create a database for `AuthService` (`auth_db`).
   - Create a database for `TaskService` (`task_db`).

3. **Update `application.properties`**:
   - In `authservice/src/main/resources/application.properties`:
     ```properties
     spring.datasource.url=jdbc:postgresql://localhost:5432/auth_db
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     spring.jpa.hibernate.ddl-auto=update
     spring.jpa.show-sql=true
     ```
   - In `taskservice/src/main/resources/application.properties`:
     ```properties
     spring.datasource.url=jdbc:postgresql://localhost:5432/task_db
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     spring.jpa.hibernate.ddl-auto=update
     spring.jpa.show-sql=true
     ```

---

## How to Run

### Prerequisites
- Java 17+
- PostgreSQL database


### Steps

1. **Start the Backend**:
   - Navigate to `Backend/authservice` and run:
     ```sh
     mvn spring-boot:run
     ```
     This will start the `AuthService` on `http://localhost:8081`.

   - Navigate to `Backend/taskservice` and run:
     ```sh
     mvn spring-boot:run
     ```
     This will start the `TaskService` on `http://localhost:8082`.

2. **Start the Frontend**:
   - Open `http://localhost:3000` in your browser.

3. **Access the Application**:
   - Use the login and registration forms to interact with the backend.

---

## Features
1. **User Authentication**:
   - Login and registration.
   - JWT-based authentication.
2. **Task Management**:
   - Create, update, and delete tasks.
3. **Responsive Design**:
   - Optimized for desktop and mobile devices.

---
