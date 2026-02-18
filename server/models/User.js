const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // Simple password for now, or just email login if no auth is strictly required, but let's add password for basic auth
    collegeID: { type: String },
    contactNumber: { type: String },
    role: { type: String, default: "user" }, // user, admin
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
