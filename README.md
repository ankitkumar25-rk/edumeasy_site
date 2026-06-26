# EduMEasy

EduMEasy is a production-grade e-commerce and content platform for selling Math Labs and Math Kits to schools across India.

## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- PASETO v4.local Access and Refresh Tokens
- Valkey token and rate limit store
- Razorpay SDK
- Cloudinary media storage
- Resend API for notifications
- Pino logger
- Helmet and CORS security headers

### Frontend
- React 19
- Vite
- Tailwind CSS v4
- React Router v6
- Axios with interceptors
- React Hook Form
- Zod schema validation
- Framer Motion animations

## Directory Structure

```
edumeasy/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── api/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── prisma/
│   ├── routes/
│   ├── utils/
│   ├── validators/
│   ├── app.js
│   ├── server.js
│   └── package.json
└── README.md
```

## Local Development Setup

### Prerequisites
- Node.js (v18+)
- npm
- PostgreSQL database
- Valkey or Redis instance

### Environment Setup

1. Copy the environment template file:
   ```bash
   cp .env.example server/.env
   ```

2. Adjust the variables in `server/.env` to match your local setup.

### Installation

1. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

2. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

### Database Management

1. Generate the Prisma Client:
   ```bash
   cd server
   npx prisma generate
   ```

2. Run database migrations:
   ```bash
   npm run migrate
   ```

3. Seed the database with initial developer records:
   ```bash
   npm run seed
   ```

4. Launch Prisma Studio database interface:
   ```bash
   npm run studio
   ```

### Running the Application

To run the server with hot-reloading:
```bash
cd server
npm run dev
```

To run the client dev server:
```bash
cd client
npm run dev
```
