# User Authentication API Documentation

This document provides an overview of the user authentication APIs implemented in the backend. It explains the purpose of each API, the use of `accessToken` and `refreshToken`, and the validation logic used to ensure secure and reliable operations.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Authentication Flow](#authentication-flow)
3. [API Endpoints](#api-endpoints)
   - [User Controller](#user-controller)
   - [Project Controller](#project-controller)
4. [Validation Middleware](#validation-middleware)
5. [Tokens: AccessToken and RefreshToken](#tokens-accesstoken-and-refreshtoken)
6. [Error Handling](#error-handling)
7. [CheckAuth Middleware](#checkauth-middleware)

---

## Introduction

This backend provides a secure user authentication system using **JWT (JSON Web Tokens)**. It includes:

- User registration
- User login
- Token-based authentication with `accessToken` and `refreshToken`
- Token refresh mechanism
- Logout functionality

---

## Authentication Flow

1. **Register**: A new user registers with their details (firstname, lastname, email, password). The password is hashed before saving to the database.
2. **Login**: The user logs in with their email and password. If valid, an `accessToken` and `refreshToken` are generated and sent as HTTP-only cookies.
3. **Access Token**: Used to authenticate requests to protected resources. It has a short lifespan (e.g., 15 minutes).
4. **Refresh Token**: Used to generate a new `accessToken` when it expires. It has a longer lifespan (e.g., 7 days).
5. **Logout**: Clears the tokens from the client.

---

## API Endpoints

### User Controller

1. **Register User**

   - **Endpoint**: `POST /api/users/register`
   - **Description**: Registers a new user by saving their details in the database.
   - **Request Body**:
     ```json
     {
       "firstname": "John",
       "lastname": "Doe",
       "email": "john.doe@example.com",
       "password": "password123"
     }
     ```
   - **Response**:
     - **Success** (`201 Created`):
       ```json
       {
         "success": true,
         "user": {
           "id": "userId",
           "firstname": "John",
           "lastname": "Doe",
           "email": "john.doe@example.com",
           "avatar": "JD"
         }
       }
       ```
     - **Error** (`400 Bad Request`):
       ```json
       {
         "success": false,
         "message": "All fields are required."
       }
       ```

2. **Login User**

   - **Endpoint**: `POST /api/users/login`
   - **Description**: Authenticates a user and generates access and refresh tokens.
   - **Request Body**:
     ```json
     {
       "email": "john.doe@example.com",
       "password": "password123"
     }
     ```
   - **Response**:
     - **Success** (`200 OK`):
       ```json
       {
         "success": true,
         "user": {
           "id": "userId",
           "firstname": "John",
           "lastname": "Doe",
           "email": "john.doe@example.com",
           "avatar": "JD"
         }
       }
       ```
     - **Error** (`401 Unauthorized`):
       ```json
       {
         "success": false,
         "message": "Invalid credentials."
       }
       ```

3. **Refresh Token**

   - **Endpoint**: `POST /api/users/refresh-token`
   - **Description**: Generates a new access token using the refresh token.
   - **Response**:
     - **Success** (`200 OK`):
       ```json
       {
         "success": true
       }
       ```
     - **Error** (`400 Bad Request`):
       ```json
       {
         "success": false,
         "message": "Invalid token or user not found."
       }
       ```

4. **Logout User**

   - **Endpoint**: `POST /api/users/logout`
   - **Description**: Logs out the user by clearing the access and refresh tokens.
   - **Response**:
     - **Success** (`200 OK`):
       ```json
       {
         "success": true,
         "message": "User logged out successfully."
       }
       ```

5. **Get User Profile**
   - **Endpoint**: `GET /api/users/profile`
   - **Description**: Fetches the profile of the authenticated user.
   - **Response**:
     - **Success** (`200 OK`):
       ```json
       {
         "user": {
           "id": "userId",
           "firstname": "John",
           "lastname": "Doe",
           "email": "john.doe@example.com",
           "avatar": "JD"
         }
       }
       ```

---

### Project Controller

1. **Create Project**

   - **Endpoint**: `POST /api/projects`
   - **Description**: Creates a new project.
   - **Request Body**:
     ```json
     {
       "name": "New Project",
       "teamId": "teamId"
     }
     ```
   - **Response**:
     - **Success** (`201 Created`):
       ```json
       {
         "success": true,
         "message": "Project created successfully.",
         "project": {
           "id": "projectId",
           "name": "New Project",
           "owner": "userId",
           "team": "teamId",
           "members": [
             {
               "user": "userId",
               "role": "owner"
             }
           ],
           "activityLogs": [
             {
               "message": "Project created by John",
               "createdBy": "userId"
             }
           ]
         }
       }
       ```
     - **Error** (`400 Bad Request`):
       ```json
       {
         "success": false,
         "message": "Project name is required."
       }
       ```

2. **Get User Projects**
   - **Endpoint**: `GET /api/projects`
   - **Description**: Fetches all projects where the user is the owner or a member.
   - **Response**:
     - **Success** (`200 OK`):
       ```json
       {
         "success": true,
         "projects": [
           {
             "id": "projectId",
             "name": "New Project",
             "owner": {
               "id": "userId",
               "firstname": "John",
               "lastname": "Doe",
               "avatar": "JD"
             },
             "team": {
               "id": "teamId",
               "name": "Team Name"
             },
             "members": [
               {
                 "user": {
                   "id": "userId",
                   "firstname": "John",
                   "lastname": "Doe",
                   "avatar": "JD"
                 },
                 "role": "owner"
               }
             ]
           }
         ]
       }
       ```

---

### Detailed Description of Controllers

#### User Controller

- **registerUser**: Handles user registration by validating input, checking for existing users, and creating a new user. Generates access and refresh tokens.
- **loginUser**: Authenticates a user by verifying email and password. Generates and stores tokens.
- **refreshTokenHandler**: Validates the refresh token and generates new tokens.
- **logoutUser**: Clears tokens from cookies and database.
- **getUser**: Fetches the authenticated user's profile.

#### Project Controller

- **createProject**: Creates a new project with the provided name and optional team ID. Adds the creator as the owner.
- **getUserProjects**: Retrieves all projects where the user is the owner or a member. Populates related fields like owner, team, and members.

---

## Validation Middleware

The `validateRequest` middleware ensures that all required fields are present and valid in the request body. It uses `express-validator` for validation.

**Example Validation**:

- `firstname`: Must not be empty.
- `email`: Must be a valid email address.
- `password`: Must be at least 6 characters long.

**Error Response**:

```json
{
  "success": false,
  "errors": [
    {
      "msg": "Firstname is required.",
      "param": "firstname",
      "location": "body"
    },
    { "msg": "Invalid email address.", "param": "email", "location": "body" }
  ]
}
```

---

## Tokens: AccessToken and RefreshToken

### **AccessToken**:

- **Purpose**: Used to authenticate requests to protected resources.
- **Lifespan**: Short (e.g., 15 minutes).
- **Storage**: Sent as an HTTP-only cookie.

### **RefreshToken**:

- **Purpose**: Used to generate a new `accessToken` when it expires.
- **Lifespan**: Longer (e.g., 7 days).
- **Storage**: Sent as an HTTP-only cookie and stored in the database.

**Why Use Both?**

- **AccessToken**: Short lifespan reduces the risk of misuse if intercepted.
- **RefreshToken**: Allows seamless re-authentication without requiring the user to log in again.

---

## Error Handling

The `ApiError` class is used to handle custom errors with specific status codes and messages. If an error occurs, it is logged to the console, and a meaningful response is sent to the client.

**Example Error Response**:

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## CheckAuth Middleware

**Description**: The `checkAuth` middleware is used to protect routes by ensuring that only authenticated users can access them. It verifies the `accessToken` provided in the request and attaches the authenticated user's data to the `req` object.

**How It Works**:

1. Extracts the `accessToken` from either the `Authorization` header or cookies.
2. Verifies the token using the `ACCESS_TOKEN_SECRET`.
3. Fetches the user associated with the token from the database.
4. Attaches the user data (excluding sensitive fields like `password` and `refreshToken`) to the `req` object.
5. Calls the `next()` function to proceed to the next middleware or route handler.

**Error Handling**:

- If the token is missing, invalid, or expired, an appropriate error response is sent.
- Logs errors to the console for debugging purposes.

**Example Usage**:

```javascript
import { checkAuth } from "../middlewares/auth.middleware.js";

router.get("/profile", checkAuth, getUser);
```

**Error Response**:

- **Missing Token** (`400 Bad Request`):

  ```json
  {
    "success": false,
    "message": "Token is missing."
  }
  ```

- **Invalid Token** (`400 Bad Request`):

  ```json
  {
    "success": false,
    "message": "Not a valid token."
  }
  ```

- **Unauthorized** (`401 Unauthorized`):
  ```json
  {
    "success": false,
    "message": "Unauthorized or invalid token."
  }
  ```

---

## Conclusion

This documentation provides a detailed overview of the user authentication APIs. The system is designed to be secure, scalable, and user-friendly, leveraging best practices like token-based authentication, validation, and error handling.
