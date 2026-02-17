# Node.js Web Dashboard

Simple web dashboard built with **Node.js + Express + EJS + MongoDB (Mongoose)**.

## Features

- Login page
- Main dashboard cards:
  - Total Users
  - Pending Tasks (dummy data)
  - Recent Activities (dummy data)
- User table with CRUD:
  - Add user
  - Update user
  - Delete user
- Professional UI using Bootstrap CDN

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start MongoDB locally (default URI used):

   ```bash
   mongodb://127.0.0.1:27017/dashboard_db
   ```

   Or set custom URI:

   ```bash
   export MONGODB_URI='your_mongodb_connection_string'
   ```

3. Run app:

   ```bash
   npm start
   ```

4. Local preview link:

   ```
   http://localhost:3000
   ```
