const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const Payment = require("../models/Payment");

// Create a new job (Initially unverified)
router.post("/create", async (req, res) => {
    try {
        const { email, jobData, utr } = req.body;

        const newJob = new Job({
            ...jobData,
            isVerified: false // Needs manual verification by admin
        });

        const savedJob = await newJob.save();

        // Link the job ID to the pending payment if jobId wasn't provided yet
        if (utr) {
            await Payment.findOneAndUpdate(
                { utr: utr },
                { jobId: savedJob._id }
            );
        }

        res.status(201).json(savedJob);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all verified jobs (Public - limited details)
router.get("/", async (req, res) => {
    try {
        const jobs = await Job.find({ isVerified: true }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get job details (Protected details - requires payment)
router.get("/:id", async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ error: "Job not found" });

        const { email } = req.query;

        if (!email) {
            return res.json({
                _id: job._id,
                jobTitle: job.jobTitle,
                wage: job.wage,
                jobType: job.jobType,
                createdAt: job.createdAt,
                isLocked: true
            });
        }

        // Check if user has a verified payment to view "job_details" for this specific jobId
        const detailsPayment = await Payment.findOne({
            email,
            purpose: "view_details",
            jobId: job._id,
            status: "verified"
        });

        // Check if user has a verified payment to view the job in general (old logic)
        const jobPayment = await Payment.findOne({
            email,
            purpose: "view_job",
            jobId: job._id,
            status: "verified"
        });

        if (detailsPayment || jobPayment || job.publisherEmail === email) {
            // Return full details including publisher info
            return res.json({
                ...job._doc,
                isLocked: false,
                isPublisherInfoLocked: false
            });
        } else {
            // Return job content but lock publisher details
            return res.json({
                _id: job._id,
                jobTitle: job.jobTitle,
                description: job.description,
                wage: job.wage,
                jobType: job.jobType,
                createdAt: job.createdAt,
                isLocked: false,
                isPublisherInfoLocked: true
            });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a job (Admin only)
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedJob = await Job.findByIdAndDelete(id);

        if (!deletedJob) {
            return res.status(404).json({ error: "Job not found" });
        }

        // Also delete associated payments if necessary, but usually we keep them for records.
        // For now, just deleting the job is enough to remove it from the site.

        res.json({ message: "Job deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
