const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// @route   GET api/courses
// @desc    Get all courses
// @access  Public
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().select("name fee -_id"); // Only select name and fee fields
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.get("/:courseName", async (req, res) => {
  const courseName = req.params.courseName;

  try {
    const course = await Course.findOne({ name: courseName }).select(
      "name fee -_id"
    );
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
