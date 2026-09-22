# 🔧 ZM Dost — Backend API

Backend API for **ZM Dost Building Management System**, a production web application developed to manage building operations, customers, employees, rooms, agreements, revenue, reports, and other business data.

> 🚀 **Developed and deployed for real-world client use.**

---

## 📌 Overview

The ZM Dost backend provides the server-side functionality and REST APIs used by the ZM Dost frontend application.

It handles:

* API requests
* Authentication
* Business logic
* Database operations
* Data validation
* CRUD operations
* Protected resources
* Communication between the frontend and database

The backend is maintained separately from the Next.js frontend.

---

## 🛠️ Technology Stack

### Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=nodedotjs\&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge\&logo=express\&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)

### Database

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)

### API & Authentication

* REST API
* HTTP requests
* Authentication & authorization
* Protected API routes
* CRUD operations
* JSON-based data exchange

### Development Tools

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge\&logo=git\&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge\&logo=github\&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge\&logo=npm\&logoColor=white)

---

## 🏢 System Modules

The backend supports multiple areas of the Building Management System, including:

* 👥 Customer Management
* 👨‍💼 Employee Management
* 🏢 Building & Property Management
* 🏠 Room / Unit Management
* 📄 Agreement Management
* 💰 Revenue & Financial Data
* 📊 Reports & Analytics
* 🔐 User Authentication
* 📈 Dashboard Data
* 🔄 Business Activity & Status Updates

---

## 🌐 Live Application

🚀 **Live Website:** https://zmdost.com

This backend powers the production **ZM Dost Building Management System** currently deployed at the live domain above.

The backend API is maintained separately from the Next.js frontend.


## 🔗 Frontend Repository

The frontend is developed separately using **Next.js**.

### 🌐 ZM Dost Frontend

https://github.com/Aliashraf-1/zm-dost-frontend

The frontend communicates with this backend through REST APIs.

```text
┌─────────────────────────┐
│     Next.js Frontend    │
│      React + Tailwind   │
└────────────┬────────────┘
             │
             │ REST API
             ▼
┌─────────────────────────┐
│    Node.js + Express    │
│       Backend API       │
└────────────┬────────────┘
             │
             │ Database Operations
             ▼
┌─────────────────────────┐
│         MongoDB         │
└─────────────────────────┘
```

---

## 📁 Project Structure

```text
zm-dost-backend/
│
├── src/              # Backend source code
├── seed.js           # Database seeding / initial data
├── server.js         # Application entry point
├── package.json      # Dependencies & scripts
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Aliashraf-1/zm-dost-backend.git
```

### 2. Navigate to the project

```bash
cd zm-dost-backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file and add the required configuration.

Example:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

> Never commit production credentials, database passwords, API keys, or other sensitive information to GitHub.

### 5. Start the development server

```bash
npm run dev
```

If the project uses the standard Node start command:

```bash
npm start
```

---

## 🌐 Deployment

The backend has been deployed as part of the **ZM Dost Building Management System** and supports the production frontend application.

Production credentials, database connection details, and private infrastructure information are intentionally excluded from this repository.

---

## 🔐 Security & Privacy

This project contains client-specific business logic and data.

For security and privacy:

* Production credentials are not included.
* Environment variables are kept outside the repository.
* Private client information is not publicly documented.
* Production database information is not exposed.
* Sensitive configuration must be provided through environment variables.

---

## 📌 Project Status

**Production — Client in Use**

This backend is part of a real-world Building Management System developed and deployed for client operations.

---

## 👨‍💻 Developer

### Ali Ashraf

**Full-Stack Web Developer**

* MERN Stack
* Next.js
* Node.js
* Express.js
* MongoDB
* Laravel & PHP
* MySQL
* Tailwind CSS

🎓 BS Information Technology — University of Sargodha

---

⭐ If you find this project interesting, consider giving the repository a star.

```


### Ek important correction

Tumhari actual repo mein jo files/folders hain, unke naam ko README mein **exactly actual structure ke according** rakhna important hai. Jo `src/`, `server.js`, `seed.js` humne mention kiye hain woh tumhari repository structure ke mutabiq hain.

Aur `.env` wali example mein **apni actual MongoDB URI bilkul mat paste karna**. Sirf placeholder rehne do.

**Ab ye commit kar do.**

Uske baad hum **Step 4: GitHub profile ke “Pinned repositories”** set karenge. Wahan BMS ki dono repos ko ek saath strategically display karenge, phir tumhare baaki projects select karenge.
```
