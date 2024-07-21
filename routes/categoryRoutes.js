// routes/categoryRoutes.js

const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { adminAuth, studentAuth } = require("../middleware/auth");

// Route to fetch all categories
router.get("/", adminAuth, categoryController.getAllCategories);
router.get(
  "/studentcategory/",
  studentAuth,
  categoryController.getAllCategories
);
router.get(
  "/studentcategoryadmin/",
  adminAuth,
  categoryController.getAllCategories
);

// Route to add a new category
router.post("/", adminAuth, categoryController.addCategory);

// Route to update a category
router.put("/:id", adminAuth, categoryController.updateCategory);

// Route to delete a category
router.delete("/:id", adminAuth, categoryController.deleteCategory);

module.exports = router;
