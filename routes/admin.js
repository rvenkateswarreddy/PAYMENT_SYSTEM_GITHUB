// routes/admin.js
const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  updateStudentById,
  deleteStudentById,
  addStudent,
} = require("../controllers/adminStudentController");
const {
  getAllPayments,
  getPaymentById,
  updatePaymentById,
} = require("../controllers/adminPaymentController");

const { getDashboard } = require("../controllers/adminDashboardController");
const {
  getFeeCollectionReport,
  getFeeStatusReport,
  generateCustomReport,
} = require("../controllers/adminReportsController");

// Middleware for admin authentication
const { adminAuth } = require("../middleware/auth");
const { addAdmin, updateAdminProfile, deleteAdminProfile, getAdminProfile, getAllAdminProfile } = require("../controllers/adminController");

// Student routes
router.get("/students", adminAuth, getAllStudents);
router
  .route("/students/:userId")
  .get(adminAuth, getStudentById)
  .put(adminAuth, updateStudentById)
  .delete(adminAuth, deleteStudentById);
router.post("/students/add", adminAuth, addStudent);

// Payment routes
router.get("/payments", adminAuth, getAllPayments);
router
  .route("/payments/:paymentId")
  .get(adminAuth, getPaymentById)
  .put(adminAuth, updatePaymentById);



// Dashboard route
router.get("/dashboard", adminAuth, getDashboard);

// Report routesP
router.get("/reports/fee-collection", adminAuth, getFeeCollectionReport);
router.get("/reports/fee-status", adminAuth, getFeeStatusReport);
router.post("/reports/custom", adminAuth, generateCustomReport);
router.get("/profile/:id",adminAuth, getAdminProfile);
router.get("/profile",adminAuth, getAllAdminProfile);

// Route to add a new admin
router.post("/profile", adminAuth,addAdmin);

// Route to update admin profile
router.put("/profile/:id", adminAuth,updateAdminProfile);

// Route to delete admin profile
router.delete("/profile/:id",adminAuth,deleteAdminProfile);

module.exports = router;
