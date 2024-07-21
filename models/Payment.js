const mongoose = require("mongoose");
const PaymentSchema = new mongoose.Schema({
  studentpaymentid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  paymentIntentId: {
    type: String,
    required: true,
  },
  studentName: { type: String, required: true },
  studentAdmissionNo: { type: String, required: true },
  studentEmail: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Payment", PaymentSchema);
