# Hospital Management System - Startup Guide

This document provides complete instructions to set up, configure, and run the Hospital Management System using MySQL and Spring Boot.

---

## 🛠️ System Requirements & Architecture

- **Backend Framework**: Spring Boot 3.2.3 (Java 17)
- **Frontend Framework**: React 18 + Vite (Node.js)
- **Database**: MySQL 8.0 (Docker Container on Port 3307)

---

## 🔑 Database Credentials & Configuration

The application is configured to connect to MySQL via `backend/src/main/resources/application.yml`.

| Parameter | Value |
|---|---|
| **Host** | `localhost` |
| **Port** | `3307` |
| **Database Name** | `hospital_db` |
| **Username** | `root` |
| **Password** | `rootpassword` |

---

## 🚀 Step-by-Step Startup Guide

### Step 1: Start MySQL Database (Docker)

Ensure Docker Desktop is running, then start the MySQL container:

```powershell
docker start hospital-mysql
```

> **Note**: To verify that MySQL is healthy and listening on port 3307, run:
> ```powershell
> docker ps --filter "name=hospital-mysql"
> ```

---

### Step 2: Build and Start the Spring Boot Backend

1. Open a terminal and navigate to the `backend` directory:
   ```powershell
   cd backend
   ```

2. Build the JAR package (skipping tests):
   ```powershell
   mvn clean package -DskipTests
   ```

3. Run the Spring Boot application:
   ```powershell
   java -jar target/hospital-management-1.0.0.jar
   ```

> **Success Check**: The console will log `Tomcat started on port 8080 (http)` and `Started HospitalManagementApplication`. Domain tables (`users`, `doctors`, `patients`, `specializations`, `appointments`) will be created automatically in MySQL.

---

### Step 3: Start the React Frontend

1. Open a new terminal window and navigate to the `frontend` directory:
   ```powershell
   cd frontend
   ```

2. Install dependencies (only needed once):
   ```powershell
   npm install
   ```

3. Start the Vite development server:
   ```powershell
   npm run dev
   ```

> **Success Check**: The server will start at **`http://localhost:5173`**.

---

## 👤 Pre-seeded Demo Accounts

The database automatically initializes with sample data on startup. You can log into the application using any of the following credentials:

| Role | Email | Password |
|---|---|---|
| **System Admin** | `admin@hospital.com` | `admin123` |
| **Doctor** | `dr.priya@hospital.com` | `doctor123` |
| **Patient** | `rahul@gmail.com` | `patient123` |

---

## 💡 Switching Back to H2 In-Memory Database (Optional)

If you wish to run the backend without a running MySQL instance, you can use the embedded H2 profile:

```powershell
java -jar target/hospital-management-1.0.0.jar --spring.profiles.active=h2
```
> The H2 database console will be available at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:hospital_db`, User: `sa`, Password: empty).
