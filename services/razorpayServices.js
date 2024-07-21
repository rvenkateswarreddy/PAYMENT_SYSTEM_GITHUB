// backend/services/razorpayService.js

const Razorpay = require("razorpay");
// Assuming you have a config file for keys

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// Function to fetch payment details by payment ID
const fetchPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error("Error fetching payment details:", error);
    throw error;
  }
};
const list10AllPayments = async () => {
  try {
    const payments = await razorpay.payments.all();
    return payments;
  } catch (error) {
    console.error("Error listing payments:", error);
    throw error;
  }
};
const listAllPayments = async (skip = 0, payments = []) => {
  try {
    const count = 100; // Razorpay allows up to 100 payments per request
    const response = await razorpay.payments.all({ count, skip });
    const newPayments = payments.concat(response.items);

    if (response.items.length === count) {
      return await listAllPayments(skip + count, newPayments);
    } else {
      return newPayments;
    }
  } catch (error) {
    console.error("Error listing payments:", error);
    throw error;
  }
};
module.exports = {
  fetchPaymentDetails,
  listAllPayments,
  list10AllPayments,
};
