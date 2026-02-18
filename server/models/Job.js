const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    jobTitle: { type: String, required: true },
    description: { type: String, required: true },
    providerName: { type: String, required: true },
    collegeID: { type: String, required: true }, // This will store the image path or base64
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    publisherEmail: { type: String, required: true }, // Who posted this job
    wage: { type: String, required: true },
    jobType: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", jobSchema);
