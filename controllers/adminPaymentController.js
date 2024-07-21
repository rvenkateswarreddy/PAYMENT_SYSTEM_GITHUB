const Payment = require("../models/Payment");
const { validationResult } = require("express-validator");

// @route   GET api/admin/payments
// @desc    Retrieve all payments
// @access  Private (Admin)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/admin/payments/:paymentId
// @desc    Retrieve payment by ID
// @access  Private (Admin)
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({ msg: "Payment not found" });
    }

    res.json(payment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Payment not found" });
    }
    res.status(500).send("Server Error");
  }
};

// @route   PUT api/admin/payments/:paymentId
// @desc    Update payment by ID
// @access  Private (Admin)
exports.updatePaymentById = async (req, res) => {
  const { status, method } = req.body;

  // Build payment object
  const paymentFields = {};
  if (status) paymentFields.status = status;
  if (method) paymentFields.method = method;

  try {
    let payment = await Payment.findById(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({ msg: "Payment not found" });
    }

    payment = await Payment.findByIdAndUpdate(
      req.params.paymentId,
      { $set: paymentFields },
      { new: true }
    );

    res.json(payment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Payment not found" });
    }
    res.status(500).send("Server Error");
  }
};
