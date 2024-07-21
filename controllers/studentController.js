const mongoose = require("mongoose");
const Student = require("../models/Student");
const Payment = require("../models/Payment");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const Fee = require("../models/Fee");
const Category = require("../models/Category");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: "rzp_test_KStLt14203VFVn",
  key_secret: "Od2TZxpkVAXRQhxogFzzN3Nf",
});

// @route   GET api/students/dashboard
// @desc    Retrieve student dashboard data (profile, payment details, history)
// @access  Private (Student)

// @route   GET api/students/profile
// @desc    Get student profile information
// @access  Private (Student)
exports.getStudentProfile = async (req, res) => {
  try {
    console.log("req.user:", req.user); // Log the req.user object
    const student = await Student.findById(req.user.id).select("-password");
    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   PUT api/students/profile
// @desc    Update student profile information
// @access  Private (Student)
exports.updateStudentProfile = async (req, res) => {
  const { name, admissionNo, courseName, email, phone } = req.body;

  // Build student object
  const studentFields = {};
  if (name) studentFields.name = name;
  if (admissionNo) studentFields.admissionNo = admissionNo;
  if (courseName) studentFields.courseName = courseName;
  if (email) studentFields.email = email;
  if (phone) studentFields.phone = phone;

  try {
    let student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    student = await Student.findByIdAndUpdate(
      req.user.id,
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

exports.getPaymentDetails = async (req, res) => {
  const { paymentId } = req.params;

  try {
    const payment = await Payment.findById(paymentId).populate(
      "studentpaymentid",
      "name email"
    );

    if (!payment) {
      return res.status(404).json({ msg: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    console.error("Error in getPaymentDetails:", error.message);
    res.status(500).send("Server Error");
  }
};

// Get payment history for a student
exports.getPaymentHistory = async (req, res) => {
  const { studentId } = req.params;

  try {
    const payments = await Payment.find({ studentpaymentid: studentId }).sort({
      date: -1,
    });
    console.log(payments);
    if (!payments) {
      return res
        .status(404)
        .json({ msg: "No payment history found for this student" });
    }

    res.json(payments);
  } catch (error) {
    console.error("Error in getPaymentHistory:", error.message);
    res.status(500).send("Server Error");
  }
};

// Get payment reports
exports.getPaymentReports = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("studentpaymentid", "name email")
      .sort({ date: -1 });

    if (!payments) {
      return res.status(404).json({ msg: "No payment reports found" });
    }

    res.json(payments);
  } catch (error) {
    console.error("Error in getPaymentReports:", error.message);
    res.status(500).send("Server Error");
  }
};

exports.makePayment = async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // Convert to smallest currency unit
    currency: "INR",
    receipt: `payment_${Date.now()}`,
    // Auto-capture payment
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getFees = async (req, res) => {
  try {
    const fees = await Fee.find({ studentfeeId: req.params.studentId });
    if (!fees) {
      return res.status(404).json({ msg: "Fees not found" });
    }
    res.json(fees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rvenkateswarreddy12345@gmail.com", // Your email address
    pass: "ixre adqd kylo ojiz", // Your email password or app-specific password
  },
});

exports.verifyPayment = async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    studentId,
    amount,
    categoryId,
  } = req.body;

  try {
    // Validate studentId (assuming it's a valid MongoDB ObjectId)
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ msg: "Invalid student ID format" });
    }

    const studentObjectId = new mongoose.Types.ObjectId(studentId);
    const student = await Student.findById(studentId).select(
      "name email admissionNo"
    );

    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", razorpay.key_secret)
      .update(body.toString())
      .digest("hex");

    let paymentStatus;
    if (expectedSignature === razorpay_signature) {
      paymentStatus = "success";
    } else {
      paymentStatus = "failed";
    }

    // Save payment details
    const payment = new Payment({
      studentpaymentid: studentObjectId,
      amount,
      status: paymentStatus,
      paymentIntentId: razorpay_payment_id,
      studentName: student.name,
      studentAdmissionNo: student.admissionNo,
      studentEmail: student.email,
      date: Date.now(),
    });

    await payment.save();

    if (paymentStatus === "success") {
      // Fetch the category details based on categoryId
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ msg: "Category not found" });
      }

      // Update fee details
      let fee = await Fee.findOne({
        studentfeeId: studentObjectId,
        categoryId,
      });
      if (fee) {
        // Update existing fee entry
        fee.paidFees = parseFloat(fee.paidFees) + parseFloat(amount);
        fee.pendingFees = parseFloat(fee.pendingFees) - parseFloat(amount);
      } else {
        // New fee entry for the category
        const totalFees = category.amount;
        fee = new Fee({
          studentfeeId: studentObjectId,
          categoryName: category.name,
          categoryId,
          course: category.course,
          totalFees,
          studentName: student.name,
          studentAdmissionNo: student.admissionNo,
          studentEmail: student.email,
          paidFees: amount,
          pendingFees: totalFees - amount,
        });
      }

      await fee.save();

      // Send email notification
      const mailOptions = {
        from: "rvenkateswarreddy12345@gmail.com",
        to: student.email,
        subject: "Payment Successful Notification",
        html: `
          <p>Hello ${student.name},</p>
          <p>Your payment of ₹${amount} for the ${category.name} category has been successfully received.</p>
          <p>Total Fees: ₹${category.amount}</p>
          <p>Paid Amount: ₹${fee.paidFees}</p>
          <p>Pending Amount: ₹${fee.pendingFees}</p>
          <p>Thank you for your payment.</p>
          <p>Sincerely,</p>
          <p>SV University</p>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    }

    // Respond with the appropriate message based on payment status
    if (paymentStatus === "success") {
      res.json({ status: "Payment successful" });
    } else {
      res
        .status(400)
        .json({ msg: "Invalid signature, payment verification failed" });
    }
  } catch (error) {
    console.error("Error in verifyPayment:", error.message);
    res.status(500).send("Server Error");
  }
};
