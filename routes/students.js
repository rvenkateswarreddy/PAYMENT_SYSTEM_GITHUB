const express = require("express");
const router = express.Router();
const {
  getStudentDashboard,
  getStudentProfile,
  updateStudentProfile,
  getPaymentDetails,
  getPaymentHistory,
  makePayment,
  verifyPayment,
  getPaymentReports,
  getFees,
  handleRazorpayWebhook,
} = require("../controllers/studentController");

// Middleware for student authentication
const { studentAuth, adminAuth } = require("../middleware/auth");

// @route   GET api/students/dashboard
// @desc    Retrieve student dashboard data (profile, payment details, history)
// @access  Private (Student)
// Route to get payment details by payment ID
router.get("/details/:paymentId", studentAuth, getPaymentDetails);

// Route to get payment history for a student
router.get("/history/:studentId", studentAuth, getPaymentHistory);

// Route to get payment reports
router.get("/reports", studentAuth, getPaymentReports);
router.get("/fees/:studentId", studentAuth, getFees);
// router.get("/fees/:studentId", adminAuth, getFees);
// @route   GET api/students/profile
// @desc    Get student profile information
// @access  Private (Student)
router.get("/profile", studentAuth, getStudentProfile);

// @route   PUT api/students/profile
// @desc    Update student profile information
// @access  Private (Student)
router.put("/profile", studentAuth, updateStudentProfile);

// @route   GET api/students/payments
// @desc    Get payment details (total amount, paid amount, pending amount)
// @access  Private (Student)

// @route   POST api/students/payments/make
// @desc    Initiate payment via payment gateway (Stripe/Razorpay)
// @access  Private (Student)
router.post("/payments/make", studentAuth, makePayment);
router.post("/payments/verify", studentAuth, verifyPayment);
// router.post("/webhook/razorpay", handleRazorpayWebhook);

module.exports = router;
