const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Student = require("../models/Student");
const Course = require("../models/Course");
const Payment = require("../models/Payment");
const Fee = require("../models/Fee");
// Student signup
exports.signup = async (req, res) => {
  const { name, admissionNo, courseName, email, phone, password } = req.body;

  try {
    let student = await Student.findOne({ admissionNo });

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

    const payload = {
      user: {
        id: student.id,
        role: "student", // Ensure the role is included in the payload
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Student login
exports.login = async (req, res) => {
  const { admissionNo, password } = req.body;

  try {
    let student = await Student.findOne({ admissionNo });

    if (!student) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    let payments = await Payment.findOne({ studentpaymentid: student._id });
    let fees = await Fee.findOne({ studentfeeId: student._id });
    const payload = {
      user: {
        id: student.id,
        role: "student",
        admissionNo: student.admissionNo,
        paymentId: payments?._id,
        feeID: fees?._id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "100 days" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: student._id,
            name: student.name,
            email: student.email,
            phone: student.phone,
            courseName: student.courseName,
          },
          payments,
          fees,
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
