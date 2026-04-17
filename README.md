# 🐾 PetVerse — A Social Universe for Pet Lovers

> A modern full-stack social media platform where pets are the true stars.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
![Stack](https://img.shields.io/badge/Stack-MERN-blue)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)

---

## 📖 About

PetVerse is a pet-centric social platform built for pet lovers and owners. Share your pet's moments, connect with a like-minded community, and explore pet adoption — all in one place. Built with the MERN stack, it offers real-time chat, an interactive feed, and a clean, responsive UI.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🐶 **Pet-Centric Feed** | Share posts, photos, and reels of your pets |
| 📸 **Media Uploads** | Upload images and short videos |
| ❤️ **Engagement** | Like, comment, and interact with posts |
| 💬 **Real-Time Chat** | Instant messaging powered by Socket.io |
| 🏡 **Adoption Module** | Help pets find loving homes |
| 🔐 **Authentication** | Secure JWT-based login and user management |
| 🎨 **Aesthetic UI** | Clean and fully responsive design with Tailwind CSS |

---

## 🛠️ Tech Stack

**Frontend**
- [React.js](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

**Backend**
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Socket.io](https://socket.io/) — Real-time communication

**Database**
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)

**Auth**
- JSON Web Tokens (JWT)

---

## 📂 Project Structure

```
petVerse/
├── client/                 # Frontend — React app
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Route-level pages
│       ├── context/        # React context / state
│       └── utils/          # Helper functions
│
├── server/                 # Backend — Node + Express
│   ├── controllers/        # Business logic
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route definitions
│   ├── middleware/         # Auth & error middleware
│   └── index.js            # Server entry point
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js v18+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/SachinGarg-hub/petVerse.git
cd petVerse
```

### 2. Install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server/` folder:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
```

> 💡 See `.env.example` for a full list of required variables.

### 4. Run the project

```bash
# Start the backend (from /server)
npm run dev

# Start the frontend (from /client)
npm start
```

The app will be running at `http://localhost:3000` and the API at `http://localhost:5000`.

---

## 🔌 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/posts` | Fetch all posts |
| POST | `/api/posts` | Create a new post |
| POST | `/api/posts/:id/like` | Like a post |
| GET | `/api/chat/:userId` | Fetch chat messages |
| GET | `/api/adoptions` | Browse adoption listings |

> Full API documentation coming soon.

---

## 🌟 Roadmap

- [x] User authentication (JWT)
- [x] Post feed with media uploads
- [x] Like & comment on posts
- [x] Real-time chat
- [x] Pet adoption module
- [ ] Push notifications system
- [ ] Location-based pet adoption
- [ ] AI-based pet recommendations
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "Add: your feature description"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure your code follows the existing style and that the app runs without errors before submitting.

---

## 🐛 Found a Bug?

Open an [issue](https://github.com/SachinGarg-hub/petVerse/issues) with a clear description and steps to reproduce. Screenshots are appreciated!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 💡 Author

**Sachin Garg**  
B.Tech CSE | MERN Stack Developer  

[![GitHub](https://img.shields.io/badge/GitHub-SachinGarg--hub-black?logo=github)](https://github.com/SachinGarg-hub)

---

⭐ *If you found this project helpful, give it a star — it means a lot!*
