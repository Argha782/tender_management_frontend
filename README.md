# ⚡ Tender Management System – Frontend

**Live Website:** [https://tender-management.vercel.app](https://tender-management-frontend-three.vercel.app)
**Backend API:** [https://tender-management-backend.onrender.com](https://tender-management-backend.onrender.com)

---

## 📖 Overview

This is the **frontend** of the **Tender Management System** built using the **MERN stack**.  
It provides role-based interfaces and functionalities for:
- 🧑‍💼 **Super Admin** – manages all tenders and admins  
- 🏗️ **Tender Owners (Admins)** – can create, edit, and manage their own tenders  
- 👷 **Vendors/Bidders** – can view tenders and place bids  

The frontend is built with **React.js** and deployed on **Vercel**.

---

## 🛠️ Tech Stack

- **React.js**
- **Vite**
- **Tailwind CSS**
- **Headless UI**
- **Axios** (for API requests)
- **React Router DOM**
- **Context API / LocalStorage** (for authentication)

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Argha782/tender_management_frontend.git
cd tender_management_frontend
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Setup environment variables
Create a `.env` file in the root directory and add:
```env
VITE_BACKEND_URL=https://tender-management-backend.onrender.com
```

### 4️⃣ Run the development server
```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Folder Structure
```
tender_management_frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── hooks/
│   ├── assets/
│   └── App.jsx
├── public/
├── .env
└── package.json
```

---

## 🚀 Deployment
The frontend is deployed on **Vercel**.  
Ensure your backend CORS is configured to allow:
```
https://tender-management-frontend.vercel.app
```

---

## 🔗 Related Repositories
- **Backend Repository:** [https://github.com/Argha782/tender_management_backend](https://github.com/Argha782/tender_management_backend)

---

## 👨‍💻 Author
**Argha Saha**  
📧 [arghasaha782@gmail.com]  
🌐 [[LinkedIn Profile](https://www.linkedin.com/in/argha-saha-80527a208/)]
