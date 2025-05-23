# 💰 Expense Tracker App

A full-featured React-based Expense Tracker application built with Firebase Authentication and Realtime Database. It allows users to register, log in, manage their profile, track expenses, activate premium features, and switch between light and dark themes. Designed with modern development practices including context, reducers, and test-driven development.

## 🔗 Live Demo
[Visit Expense Tracker](https://expense-tracker-site-xi.vercel.app/)

## 🚀 Features & Deliverables

### ✅ 1. User Authentication
- 🔐 Signup screen with email, password, confirm password validation  
- 🔁 Login functionality with token management and redirection  
- ⚠️ Error handling with user-friendly alerts  
- 👋 Welcome screen after successful login  
- 🔓 Logout functionality clears token and redirects to login  

### ✅ 2. Profile Management
- 👤 "Complete your profile" prompt post-login  
- 📝 Editable profile form with prefilled user details using Firebase GET API  
- 📩 Email verification with one-click Firebase verification email trigger  

### ✅ 3. Password Recovery
- 🔑 "Forgot Password" screen to send Firebase reset link  
- ⏳ Loader while waiting for Firebase response  

### ✅ 4. Expense Management
- ➕ Add daily expenses with:
  - Amount
  - Description
  - Category dropdown (Food, Petrol, Salary, etc.)
- 📋 List of expenses shown below the form  
- 🔄 Realtime sync with Firebase (POST/GET)  
- 🗑️ Delete expenses (DELETE request)  
- ✏️ Edit expenses with form prefill and update (PUT request)  

### ✅ 5. Redux Integration (Best Practices)
- 💡 Auth Reducer to manage token, user ID, login status  
- 🧾 Expense Reducer to manage expense list and state sync  
- 📊 Trigger Premium Mode when expenses > ₹10,000  

### ✅ 6. Premium Features
- 🌑 Dark Theme toggle using Theme Reducer  
- 📥 Download Expenses as CSV  
- � Theme toggle button for switching modes  

### ✅ 7. Testing (TDD)
- 🧪 30+ Unit & Integration Test Cases  
- Covers authentication, expense addition, deletion, editing  
- Includes async behavior using mocked Firebase APIs  
- Built using React Testing Library and Jest  

## 🛠️ Tech Stack
- **Frontend**: React, Context API, Reducers  
- **Authentication**: Firebase Email/Password Auth  
- **Database**: Firebase Realtime Database (REST API)  
- **Testing**: React Testing Library, Jest  
- **State Management**: useReducer, Context API  
- **Theming**: CSS Modules with Light/Dark Mode  

## 📁 Project Structure (Suggested)
```
Expense-Tracker-Site/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Signup.jsx
│   │   │   ├── Login.jsx
│   │   │   └── ForgotPassword.jsx
│   │   ├── Profile/
│   │   │   ├── ProfileForm.jsx
│   │   │   └── ProfileHeader.jsx
│   │   ├── Expenses/
│   │   │   ├── AddExpense.jsx
│   │   │   ├── ExpenseList.jsx
│   │   │   └── ExpenseItem.jsx
│   │   ├── Premium/
│   │   │   ├── ActivatePremium.jsx
│   │   │   ├── DownloadCSV.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── Layout/
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── UI/
│   │   │   ├── Loader.jsx
│   │   │   └── Notification.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── ExpenseContext.jsx
│   │   └── ThemeContext.jsx
│   ├── reducers/
│   │   ├── authReducer.js
│   │   ├── expenseReducer.js
│   │   └── themeReducer.js
│   ├── firebase.js
│   ├── App.jsx
│   └── index.js
├── .gitignore
├── package.json
└── README.md
```
