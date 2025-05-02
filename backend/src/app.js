import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import verificationRoutes from './routes/verification.routes.js';
import adminRoutes from './routes/admin.routes.js';
import transactionRoutes from './routes/transaction.routes.js';

// Load environment variables
dotenv.config();

const app = express();

// Define allowed origins
const allowedOrigins = [
    process.env.CORS_ORIGIN, 
    "http://localhost:3000",
    "https://monkfish-adapted-properly.ngrok-free.app",
    "https://wallet-x-gn6u-git-master-azibmoeens-projects.vercel.app",
    "https://walletx-production.up.railway.app",
    "https://new-origin.example.com",
    "https://wallet-x-gn6u-git-master-azibmoeens-projects.vercel.app"
];
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: "Wallet API is running" });
});

app.get('/health', (_, res) => {
    console.log("Health check route accessed");
    res.status(200).json({ status: "ok", message: "Server is running" });
});

export default app;