# LinkUp — Real-Time Chat Application

LinkUp is a responsive real-time chat application built with the MERN stack and Socket.IO. It allows users to authenticate, discover other users, manage conversations, and exchange messages in real time through a clean, responsive interface.

## Features

- **User Authentication:** Register and log in securely using JWT authentication.
- **Real-Time Messaging:** Send and receive messages instantly using Socket.IO.
- **User Presence:** Display online and offline user status.
- **Conversation Management:** Create conversations and load message history.
- **Unread Message Counts:** Track unread messages in the sidebar. *(Include this feature only after implementing and testing it.)*
- **Contact Search:** Find users by name or email.
- **Responsive Interface:** Chat comfortably on desktop and mobile devices.
- **Protected Routes:** Restrict access to authenticated users.

## Tech Stack

**Frontend**
- React.js
- Tailwind CSS
- Vite
- Socket.IO Client
- React Router

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JSON Web Tokens (JWT)

## Project Structure

```text
LinkUp/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── routes/
│   ├── package.json
│   └── .env.example
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- [MongoDB](https://www.mongodb.com/) local server or a MongoDB Atlas database
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/LinkUp.git
cd LinkUp
```

Replace `YOUR-USERNAME` with your GitHub username.

### 2. Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory using `.env.example` as a reference.

Example configuration:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/linkup
JWT_SECRET=replace_with_a_secure_secret
```

Use your own secret and database connection string. Never commit your actual `.env` file.

Start the backend:

```bash
npm run dev
```

Make sure this command matches the scripts in `server/package.json`.

### 3. Configure the Frontend

Open a second terminal:

```bash
cd client
npm install
```

If your frontend requires environment variables, create its `.env` file using the appropriate example file and configure the values expected by your code.

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually:

`http://localhost:5173`

## How It Works

1. Users register and log in.
2. The backend authenticates requests using JWT.
3. The React application loads users and conversations through REST APIs.
4. Socket.IO establishes an authenticated real-time connection.
5. Users join authorized conversation rooms to exchange messages.
6. New messages update the conversation and message history.

## Learning Outcomes

Building LinkUp helped me practice:

- Full-stack application architecture
- REST API development with Express.js
- MongoDB data modeling and Mongoose
- JWT-based authentication and authorization
- Real-time event-driven communication with Socket.IO
- React hooks, Context API, and state management
- Responsive UI development with Tailwind CSS
- Git and GitHub project management

## Future Improvements

- Persistent unread message counts and read receipts
- Image and file sharing
- Typing indicators
- Message delivery and read status
- Production deployment

## Author

**Your Name**

- GitHub: [Your GitHub Profile](https://github.com/YOUR-USERNAME)
- LinkedIn: [Your LinkedIn Profile](YOUR-LINKEDIN-URL)

---

*LinkUp is a learning and portfolio project developed to demonstrate full-stack web development and real-time communication skills.*