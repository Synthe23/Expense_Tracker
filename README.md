# 💰 Expense Tracker

A full-stack expense tracking app built with **React + Tailwind**, **Express**, and **MongoDB (Mongoose)**.

---

## ✨ Features

- 🔐 JWT-based login & signup
- 📅 Custom calendar with date selection
- ➕ Add / ✏️ Edit / 🗑️ Delete expenses
- 📊 Daily bar chart for the current month
- 🧾 Day's total & monthly total in ₹
- 🔵 Calendar dots on days with expenses

---

## 📁 Project Structure

```
expense-tracker/
├── backend/          → Express + Mongoose API
└── frontend/         → React + Tailwind UI
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** (v16+)
- **MongoDB** running locally on port `27017`
  - Install: https://www.mongodb.com/try/download/community
  - Or use **MongoDB Atlas** (free cloud) and update the URI

---

### 1️⃣ Backend Setup

```bash
cd expense-tracker/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env and set your JWT_SECRET to something random

# Start dev server
npm run dev
```

Backend runs at: **http://localhost:5000**

---

### 2️⃣ Frontend Setup

```bash
cd expense-tracker/frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

### 3️⃣ Open the App

Go to **http://localhost:5173** in your browser.

1. Click **"Create one"** to register
2. Login with your credentials
3. Start tracking expenses! 🎉

---

## 🔧 Environment Variables

### backend/.env
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=change_this_to_a_random_secret_string
```

---

## 🛠 Tech Stack

| Layer    | Technology             |
|----------|------------------------|
| Frontend | React 18, Tailwind CSS, Recharts, date-fns |
| Backend  | Node.js, Express 4     |
| Database | MongoDB, Mongoose 7    |
| Auth     | JWT (jsonwebtoken), bcryptjs |
