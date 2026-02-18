const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");

// Create a new payment record
router.post("/create", async (req, res) => {
    try {
        const { email, amount, purpose, jobId } = req.body;
        const newPayment = new Payment({
            email,
            amount,
            purpose,
            jobId,
            status: "pending"
        });
        const savedPayment = await newPayment.save();
        res.status(201).json(savedPayment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get payment status by email and purpose (and optional jobId)
router.get("/status/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const { purpose, jobId } = req.query;

        let query = { email, purpose };
        if (jobId) {
            query.jobId = jobId;
        }

        // Find the most recent payment
        const payment = await Payment.findOne(query).sort({ createdAt: -1 });

        if (!payment) {
            return res.json({ status: "not_found" });
        }
        res.json({ status: payment.status });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all pending payments (for admin)
router.get("/pending", async (req, res) => {
    try {
        const payments = await Payment.find({ status: "pending" }).sort({ createdAt: -1 });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all payments (for admin)
router.get("/", async (req, res) => {
    try {
        const payments = await Payment.find().sort({ createdAt: -1 });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit a payment (from frontend)
router.post("/submit", async (req, res) => {
    try {
        const { email, amount, purpose, jobId, utr } = req.body;

        // Basic check if UTR already exists to prevent double submission
        if (utr) {
            const existing = await Payment.findOne({ utr });
            if (existing) {
                return res.status(400).json({ error: "This Transaction ID has already been submitted." });
            }
        }

        const newPayment = new Payment({
            email: email.toLowerCase(),
            amount,
            purpose,
            jobId: jobId || null,
            utr,
            status: "pending"
        });

        const savedPayment = await newPayment.save();
        res.status(201).json(savedPayment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


const Job = require("../models/Job");

// Verify a payment (Admin only)
router.put("/verify/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPayment = await Payment.findByIdAndUpdate(
            id,
            { status: "verified" },
            { new: true }
        );

        if (updatedPayment.status === "verified") {
            // If this was for a job post, mark the job as verified
            if (updatedPayment.purpose === "post_job" && updatedPayment.jobId) {
                await Job.findByIdAndUpdate(updatedPayment.jobId, { isVerified: true });
            }
        }

        res.json(updatedPayment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
