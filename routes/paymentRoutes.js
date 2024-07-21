// backend/routes/paymentRoutes.js

const express = require("express");
const router = express.Router();

const {
  getPaymentDetails,
  fetchRecentPayments,
  get10AllPayments,
  getAllPayments,
} = require("../controllers/paymentController");
const { adminAuth } = require("../middleware/auth");
const getPaymentDetailsAdmin = require("../services/razor2");
// const { getPaymentDetailsAdmin } = require("../services/razor2");
// const getPaymentDetailsAdmin = require("../services/razor2");
// const { getAllPayments } = require("../controllers/adminPaymentController");

// Route to fetch payment details by payment ID
router.get("/payments/details/:paymentId", getPaymentDetails);
router.get("/payments/all10", get10AllPayments);
router.get("/payments/all", getAllPayments);
router.get("/payments/recent", fetchRecentPayments);
router.get("/payments/recentadmin", getPaymentDetailsAdmin);

module.exports = router;
