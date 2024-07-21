const Payment = require("../models/Payment");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const getPaymentDetailsAdmin = async (req, res) => {
  try {
    // Fetch all payment intent IDs from the database
    const payments = await Payment.find({}, "paymentIntentId");
    const paymentIntentIds = payments.map((payment) => payment.paymentIntentId);

    // Fetch details for each payment intent ID
    const paymentDetails = [];
    for (let i = 0; i < paymentIntentIds.length; i++) {
      const paymentId = paymentIntentIds[i];
      try {
        const paymentDetail = await fetchPaymentDetails(paymentId);
        paymentDetails.push(paymentDetail);
      } catch (error) {
        if (error.statusCode === 429) {
          console.log("Rate limit hit, waiting before retrying...");
          await new Promise((resolve) => setTimeout(resolve, 5000)); // wait for 5 seconds
          i--; // retry the same paymentId
        } else {
          throw error;
        }
      }
    }

    res.json(paymentDetails);
  } catch (error) {
    console.error("Error in fetching payment details:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

const fetchPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error("Error fetching payment details:", error);
    throw error;
  }
};

module.exports = getPaymentDetailsAdmin;
