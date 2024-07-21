const Student = require("../models/Student");
const Payment = require("../models/Payment");
const Course = require("../models/Course");

// @route   GET api/admin/dashboard
// @desc    Retrieve admin dashboard summary (total students, fees collected, pending fees)
// @access  Private (Admin)
exports.getDashboard = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();

    const totalPayments = await Payment.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, totalFees: { $sum: "$amount" } } },
    ]);

    const totalFeesCollected =
      totalPayments.length > 0 ? totalPayments[0].totalFees : 0;

    const courses = await Course.find();
    let totalCourseFees = 0;
    courses.forEach((course) => {
      totalCourseFees += course.fee;
    });

    const pendingFees = totalCourseFees - totalFeesCollected;

    res.json({
      totalStudents,
      totalFeesCollected,
      pendingFees,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
