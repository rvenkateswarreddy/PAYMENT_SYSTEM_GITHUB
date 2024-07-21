const Student = require("../models/Student");
const Course = require("../models/Course");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

// @route   GET api/admin/students
// @desc    Retrieve all studentsf
// @access  Private (Admin)
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select("-password");
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/admin/students/:admissionNo
// @desc    Retrieve student by ID
// @access  Private (Admin)
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.admissionNo).select(
      "-password"
    );

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Student not found" });
    }
    res.status(500).send("Server Error");
  }
};

// @route   PUT api/admin/students/:admissionNo
// @desc    Update student by ID
// @access  Private (Admin)
exports.updateStudentById = async (req, res) => {
  const { name, admissionNo, courseName, email, phone } = req.body;

  // Build student object
  const studentFields = {};
  if (name) studentFields.name = name;
  if (admissionNo) studentFields.admissionNo = admissionNo;
  if (courseName) studentFields.courseName = courseName;
  if (email) studentFields.email = email;
  if (phone) studentFields.phone = phone;

  try {
    let student = await Student.findById(req.params.userId);

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    student = await Student.findByIdAndUpdate(
      req.params.userId,
      { $set: studentFields },
      { new: true }
    );

    res.json(student);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Student not found" });
    }
    res.status(500).send("Server Error");
  }
};

// @route   DELETE api/admin/students/:admissionNo
// @desc    Delete student by ID
// @access  Private (Admin)
exports.deleteStudentById = async (req, res) => {
  try {
    let student = await Student.findById(req.params.userId);

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    await Student.findByIdAndDelete(req.params.userId);

    res.json({ msg: "Student removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Student not found" });
    }
    res.status(500).send("Server Error");
  }
};

// @route   POST api/admin/students/add
// @desc    Add a new student
// @access  Private (Admin)
exports.addStudent = async (req, res) => {
  const { name, admissionNo, courseName, email, phone, password } = req.body;

  try {
    let student = await Student.findOne({ admissionNo });

    if (student) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Student already exists" }] });
    }
    if (student) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Student already exists" }] });
    }

    student = new Student({
      name,
      admissionNo,
      courseName,
      email,
      phone,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(password, salt);

    await student.save();

    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
