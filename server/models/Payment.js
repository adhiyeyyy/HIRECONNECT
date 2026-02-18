const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    purpose: { type: String, required: true }, // 'view_job' or 'post_job' or 'job_id' for viewing specific job
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' }, // Optional, linking to a specific job if purpose is viewing details
    utr: { type: String }, // Transaction ID for manual verification
    status: { type: String, default: "pending" }, // pending, verified
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
