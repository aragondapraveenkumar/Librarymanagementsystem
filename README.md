# 📚 VEMU Library Management System
### React + Node.js + MongoDB Full-Stack Conversion

A complete, production-ready rewrite of the original vanilla HTML/JS project into a modern full-stack application.

---

## 🗂 Project Structure

```
vemu-library/
├── server/                   ← Express + MongoDB backend
│   ├── models/
│   │   ├── User.js           ← User schema (bcrypt passwords)
│   │   ├── Book.js           ← Book schema
│   │   └── Library.js        ← IssuedBook, Request, Recommendation, Feedback
│   ├── routes/
│   │   ├── auth.js           ← Login / Register / /me
│   │   ├── users.js          ← Admin user management
│   │   ├── books.js          ← Book CRUD (Librarian protected)
│   │   └── library.js        ← Issue, Return, Requests, Feedback, Reports
│   ├── middleware/
│   │   └── auth.js           ← JWT verification + role guard
│   ├── index.js              ← Express app entry, DB seed
│   ├── .env.example          ← Copy to .env and configure
│   └── package.json
│
└── client/                   ← React frontend
    ├── public/index.html     ← Tailwind CDN + global CSS
    └── src/
        ├── api.js            ← Axios service layer (all API calls)
        ├── App.js            ← Router + PrivateRoute guard
        ├── context/
        │   └── AuthContext.js← Global JWT auth state
        ├── hooks/
        │   └── useToast.js   ← Toast notifications
        ├── components/
        │   ├── Navbar.js
        │   ├── Sidebar.js    ← Role-based nav menu
        │   ├── BookCard.js   ← Book cover grid card
        │   └── IssuedBookCard.js ← Loan + fine display
        └── pages/
            ├── Home.js       ← Landing page
            ├── Login.js      ← Login + demo credentials
            ├── Register.js   ← Registration form
            ├── Dashboard.js  ← Main dashboard orchestrator
            ├── DashboardViews.js  ← Welcome, Profile, Search, MyBooks
            ├── LibrarianViews.js  ← BookForm, ManageBooks, Issue, Returns, Requests, Recs
            └── OtherViews.js     ← Student/Faculty/Admin views + AddUserModal
```

---

## 🚀 Setup Instructions

### 1. Prerequisites
- **Node.js** v18+ — https://nodejs.org
- **MongoDB** — local install OR free Atlas cloud: https://mongodb.com/atlas

---

### 2. Clone / extract the project
```bash
# Navigate to your project folder
cd vemu-library
```

---

### 3. Configure the backend

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000

# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/vemu_library

# MongoDB Atlas (replace with your connection string):
# MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/vemu_library

JWT_SECRET=change_this_to_a_long_random_secret
```

---

### 4. Install dependencies

```bash
# In server/
cd server && npm install

# In client/
cd ../client && npm install
```

---

### 5. Run the app

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev        # uses nodemon for auto-reload
# OR
npm start          # production
```
Server starts at: **http://localhost:5000**

**Terminal 2 — Frontend:**
```bash
cd client
npm start
```
React app opens at: **http://localhost:3000**

---

## 🔑 Default Login Credentials

| Username    | Password  | Role      |
|-------------|-----------|-----------|
| `admin`     | `admin123`| Admin     |
| `librarian` | `lib123`  | Librarian |
| `student1`  | `stud123` | Student   |
| `faculty1`  | `fac123`  | Faculty   |

> These are auto-seeded on first run if the database is empty.

---

## 🛡 Role Permissions

| Feature                | Admin | Librarian | Faculty | Student |
|------------------------|:-----:|:---------:|:-------:|:-------:|
| Manage Users           | ✅    |           |         |         |
| System Reports         | ✅    |           |         |         |
| View Feedback          | ✅    |           |         |         |
| Backup                 | ✅    |           |         |         |
| Add/Edit/Delete Books  |       | ✅        |         |         |
| Issue Books            |       | ✅        |         |         |
| Process Returns        |       | ✅        |         |         |
| Approve Requests       |       | ✅        |         |         |
| View Recommendations   |       | ✅        |         |         |
| Reserve Book           |       |           | ✅      |         |
| Recommend Book         |       |           | ✅      |         |
| Request Book           |       |           |         | ✅      |
| Send Feedback          |       |           | ✅      | ✅      |
| Search Catalog         | ✅    | ✅        | ✅      | ✅      |
| My Borrowed Books      | ✅    | ✅        | ✅      | ✅      |

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint          | Access  |
|--------|-------------------|---------|
| POST   | /api/auth/register| Public  |
| POST   | /api/auth/login   | Public  |
| GET    | /api/auth/me      | Auth    |

### Books
| Method | Endpoint          | Access    |
|--------|-------------------|-----------|
| GET    | /api/books        | Auth      |
| POST   | /api/books        | Librarian |
| PUT    | /api/books/:id    | Librarian |
| DELETE | /api/books/:id    | Librarian |

### Library
| Method | Endpoint                          | Access          |
|--------|-----------------------------------|-----------------|
| GET    | /api/library/issues               | Librarian/Admin |
| GET    | /api/library/mybooks              | Auth            |
| POST   | /api/library/issue                | Librarian       |
| POST   | /api/library/return/:id           | Librarian       |
| GET    | /api/library/requests             | Librarian/Admin |
| POST   | /api/library/requests             | Student/Faculty |
| PUT    | /api/library/requests/:id/approve | Librarian       |
| PUT    | /api/library/requests/:id/reject  | Librarian       |
| GET    | /api/library/recommendations      | Librarian/Admin |
| POST   | /api/library/recommendations      | Faculty         |
| DELETE | /api/library/recommendations/:id  | Librarian       |
| GET    | /api/library/feedback             | Admin           |
| POST   | /api/library/feedback             | Auth            |
| GET    | /api/library/reports              | Admin           |

---

## 🔄 What Changed from the Original

| Original (Vanilla JS)         | React + MongoDB Version            |
|-------------------------------|------------------------------------|
| localStorage data store       | MongoDB persistent database        |
| Plain HTML pages (7 files)    | Single-page React app              |
| No passwords hashed           | bcrypt password hashing            |
| No real authentication        | JWT token auth with expiry         |
| Global JS variables           | React Context + hooks              |
| `innerHTML` DOM manipulation  | React components                   |
| No API layer                  | Full REST API (Express)            |
| Data lost on browser clear    | Data persists in MongoDB           |

---

## 🌐 Deploying to Production

**Backend** → Deploy to Railway, Render, or Heroku  
**Frontend** → `npm run build` then deploy to Vercel or Netlify  
**Database** → Use MongoDB Atlas (free tier works fine)

For full-stack on one server, add to `server/index.js`:
```js
const path = require('path');
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../client/build/index.html')));
```
