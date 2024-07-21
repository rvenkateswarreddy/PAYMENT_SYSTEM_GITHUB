const express = require("express");
const router = express.Router();
const Fee = require("../models/Fee");
const { adminAuth } = require("../middleware/auth");

// Get fee details for a student
router.get("/list2", async (req, res) => {
  try {
    console.log("Connecting to the database..."); // Debugging log

    const fee = await Fee.find();
    console.log("Fees retrieved:", fee); // Debugging log

    if (fee.length === 0) {
      console.log("No fee details found"); // Debugging log
      return res.status(404).json({ msg: "Fee details2 not found" });
    }

    res.json(fee);
  } catch (err) {
    console.error("Error:", err.message); // Debugging log
    res.status(500).send("Server Error");
  }
});
router.get("/feeslist", adminAuth, async (req, res) => {
  try {
    console.log("Connecting to the database..."); // Debugging log

    const fee = await Fee.find();
    console.log("Fees retrieved:", fee); // Debugging log

    if (fee.length === 0) {
      console.log("No fee details found"); // Debugging log
      return res.status(404).json({ msg: "Fee details not found" });
    }

    res.json(fee);
  } catch (err) {
    console.error("Error:", err.message); // Debugging log
    res.status(500).send("Server Error");
  }
});
router.get("/:studentId", async (req, res) => {
  try {
    const fee = await Fee.findOne({ studentId: req.params.studentId });

    if (!fee) {
      return res.status(404).json({ msg: "Fee details not found" });
    }

    res.json(fee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
