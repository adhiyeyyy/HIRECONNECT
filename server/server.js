require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://antigravity:ANTIGRAVITY123@cluster1.c62bavc.mongodb.net/hireconnect";

// Cached connection promise for serverless
let cachedConnection = null;

const connectDB = async () => {
    if (cachedConnection) {
        return cachedConnection;
    }

    console.log("Attempting to connect to MongoDB...");
    cachedConnection = mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
    }).then(conn => {
        console.log("MongoDB Connected Successfully");
        mongoose.set('bufferCommands', false);
        return conn;
    }).catch(err => {
        cachedConnection = null; // Reset on failure
        console.error("MongoDB Connection Error:", {
            message: err.message,
            code: err.code,
            name: err.name
        });
        throw err;
    });

    return cachedConnection;
};

// Middleware to ensure DB is connected for every request
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(503).json({
            error: "Database Connection Error",
            details: process.env.NODE_ENV === 'production' ? "The server is temporarily unable to connect to the database." : err.message
        });
    }
});

// Routes
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/users", require("./routes/users"));

// Admin Authentication Route
app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "adhiyeeyy" && password === "QUILONADHI@123") {
        res.json({ success: true, token: "admin-session-" + Date.now() });
    } else {
        res.status(401).json({ error: "Invalid administrator credentials" });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
