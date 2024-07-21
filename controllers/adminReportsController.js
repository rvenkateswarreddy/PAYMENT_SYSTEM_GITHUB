const Student = require("../models/Student");
const Payment = require("../models/Payment"); // Ensure this is declared only once

// @route   GET /api/admin/reports/fee-collection
// @desc    Generate bar graphs for monthly/annual fee collection
// @access  Private (Admin)
exports.getFeeCollectionReport = async (req, res) => {
  try {
    const payments = await Payment.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET /api/admin/reports/fee-status
// @desc    Generate pie charts for distribution of paid vs pending fees
// @access  Private (Admin)
exports.getFeeStatusReport = async (req, res) => {
  try {
    const paidFees = await Payment.aggregate([
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    res.json(paidFees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   POST /api/admin/reports/custom
// @desc    Generate custom reports based on specified parameters
// @access  Private (Admin)
exports.generateCustomReport = async (req, res) => {
  const { startDate, endDate, status } = req.body;

  try {
    const query = {
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    if (status) {
      query.status = status;
    }

    const customPayments = await Payment.find(query);

    res.json(customPayments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
