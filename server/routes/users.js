const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log("Registration attempt for:", email);

        const normalizedEmail = email.toLowerCase();

        // Basic check if user exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            console.log("User already exists:", normalizedEmail);
            return res.status(400).json({ error: "User already exists" });
        }

        const newUser = new User({ name, email: normalizedEmail, password, role });
        await newUser.save();
        console.log("User registered successfully:", normalizedEmail);
        res.status(201).json(newUser);
    } catch (err) {
        console.error("Registration route error:", err);
        res.status(500).json({ error: "Registration failed", details: err.message });
    }
});

// Login (Simple)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt for:", email);

        const normalizedEmail = email.toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            console.log("Login failed: User not found -", normalizedEmail);
            return res.status(404).json({ error: "User not found" });
        }

        if (user.password !== password) {
            console.log("Login failed: Invalid password for -", normalizedEmail);
            return res.status(400).json({ error: "Invalid credentials" });
        }

        console.log("Login successful for:", normalizedEmail);
        res.json(user);
    } catch (err) {
        console.error("Login route error:", err);
        res.status(500).json({ error: "Login failed", details: err.message });
    }
});

module.exports = router;
