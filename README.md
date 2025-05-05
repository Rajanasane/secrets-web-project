# Secrets Web Project

## Deployed Link

You can access the live app here:

https://secrets-web-project.onrender.com/

## Description

The Secrets Web Project is a web application built with Node.js, Express, MongoDB, and EJS. It allows users to register, log in, and share secrets securely. The application uses sessions to manage user authentication and protects certain pages to ensure only logged-in users can access them.

## Features

- **User Registration:** Users can register with an email and password.
- **User Login:** Users can log in securely with their registered credentials.
- **Secrets Page:** Users can view a protected page that displays their secrets.
- **Logout:** Users can log out from their session.
- **MongoDB Database:** User data is stored securely in MongoDB.

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB (using Mongoose ORM)
- **Authentication:** Bcrypt.js for password hashing and session management
- **View Engine:** EJS for templating
- **Session Management:** Express-session for handling user sessions
- **Environment Variables:** dotenv for managing environment variables

