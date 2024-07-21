const {
  fetchPaymentDetails,
  list10AllPayments,
  listAllPayments,
} = require("../services/razorpayServices");
const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});
// Example controller method to fetch payment details
const getPaymentDetails = async (req, res) => {
  const { paymentId } = req.params;

  try {
    const paymentDetails = await fetchPaymentDetails(paymentId);
    res.json(paymentDetails);
  } catch (error) {
    console.error("Error in fetching payment details:", error);
    res.status(500).json({ error: "Server Error" });
  }
};
const get10AllPayments = async (req, res) => {
  try {
    const payments = await list10AllPayments();
    res.json(payments);
  } catch (error) {
    console.error("Error in fetching all payments:", error);
    res.status(500).json({ error: "Server Error" });
  }
};
const getAllPayments = async (req, res) => {
  try {
    const payments = await listAllPayments();
    res.json({ items: payments });
  } catch (error) {
    console.error("Error in fetching all payments:", error);
    res.status(500).json({ error: "Server Error" });
  }
};
const fetchRecentPayments = async (req, res) => {
  try {
    const currentTime = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds
    const oneWeekAgo = currentTime - 7 * 24 * 60 * 60; // Unix timestamp of 7 days ago

    const options = {
      from: oneWeekAgo,
      to: currentTime,
      count: 10, // Limit to 10 payments
    };

    const payments = await razorpayInstance.payments.all(options);
    res.json(payments);
  } catch (error) {
    console.error("Error fetching recent payments:", error);
    res.status(500).send("Server Error");
  }
};
module.exports = {
  getPaymentDetails,
  getAllPayments,
  get10AllPayments,
  fetchRecentPayments,

  // Other controller methods related to payments
};
