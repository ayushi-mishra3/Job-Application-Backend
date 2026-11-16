import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import connectDb from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Configuration
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://job-application-frontend-nu.vercel.app",
        "https://job-application-frontend-gj9xef3k3-ayushi-mishra.vercel.app"
    ],
    credentials: true
};

app.use(cors(corsOptions));

// Health check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Job Application Backend is running successfully!"
    });
});

// Connect to MongoDB before handling API requests
app.use(async (req, res, next) => {
    try {
        await connectDb();
        next();
    } catch (error) {
        console.error("Database connection failed:", error);
        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// Local development only
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 2000;

    app.listen(PORT, () => {
        console.log(`Server running at port ${PORT}`);
    });
}

// Export Express app for Vercel
export default app;