```
#  Task Manager

A full-stack task management application built with **Node.js**, **Express**, **MongoDB**, and **React.js**. This project allows users to register, log in, and manage their daily tasks efficiently with JWT authentication.

---

##  Project Structure



Task\_Manager/
├── backend/         # Node.js + Express API
│   ├── .env         # Environment variables (MONGO\_URI, PORT, JWT\_SECRET)
│   ├── package.json
│   └── ...
│
├── frontend/        # React frontend
│   ├── package.json
│   └── ...
│
└── README.md



---

##  Prerequisites

- [Node.js](https://nodejs.org/) and npm installed
- A MongoDB URI (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Git (for cloning)

---

##  Environment Setup

###  Backend `.env` file

Inside the `backend/` folder, create a `.env` file with the following keys:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
````

---

##  How to Run the Project

### 1. Clone the repository

```bash
git clone https://github.com/Yoriichi17/Task_Manager.git
cd Task_Manager
```

### 2. Install dependencies for both frontend and backend

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 3. Start the development servers

```bash
# Start backend server
cd ../backend
npm start
```

```bash
# Start frontend server
cd ../frontend
npm start
```

The frontend will typically run at `http://localhost:3000` and the backend at `http://localhost:5000` (or your specified port).

##  Tech Stack

* **Frontend**: React.js, Axios, Bootstrap/CSS
* **Backend**: Node.js, Express, MongoDB, Mongoose
* **Auth**: JWT-based authentication
* **Database**: MongoDB (cloud/local)

##  Postman Testing

```
https://www.postman.com/maintenance-cosmologist-12845390/workspace/anirudh/collection/31320871-75074d65-9adf-4b90-a32c-ba9423028710?action=share&creator=31320871
```
## Simple Demo Video

```
https://www.loom.com/share/c0c1d9c7ec7f428ea33d41cd6f37cdc7?sid=06029a2a-092f-4dff-acd7-62cd90ce7595
```
