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

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, "../frontend")));

// Database Connection
mongoose.connect("mongodb+srv://antigravity:ANTIGRAVITY123@cluster1.c62bavc.mongodb.net/hireconnect")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Routes
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/users", require("./routes/users"));

// Specific routes for cleaner URLs (optional but nice)
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "../frontend/login.html")));
app.get("/browse", (req, res) => res.sendFile(path.join(__dirname, "../frontend/browse.html")));
app.get("/post", (req, res) => res.sendFile(path.join(__dirname, "../frontend/post.html")));
app.get("/details", (req, res) => res.sendFile(path.join(__dirname, "../frontend/details.html")));
app.get("/payment", (req, res) => res.sendFile(path.join(__dirname, "../frontend/payment.html")));
app.get("/signup", (req, res) => res.sendFile(path.join(__dirname, "../frontend/signup.html")));
app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "../frontend/admin.html")));
app.get("/admin-login", (req, res) => res.sendFile(path.join(__dirname, "../frontend/admin_login.html")));

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
