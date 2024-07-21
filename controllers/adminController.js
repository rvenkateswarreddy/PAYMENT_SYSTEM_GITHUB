const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
// Get admin profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    console.log("admin detils in backend", admin);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.find();
    console.log("admin detils in backend", admin);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new admin
exports.addAdmin = async (req, res) => {
  const { name, email, phone, password, secretKey } = req.body;
  if (secretKey !== "payment") {
    return res.status(400).json({ errors: [{ msg: "Invalid Secret Key" }] });
  }
  try {
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Admin already exists" }] });
    }

    admin = new Admin({
      name,
      email,
      phone,
      password,
      secretKey,
    });

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    await admin.save();

    res.json(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Update admin profile
exports.updateAdminProfile = async (req, res) => {
  const { name, email, phone, password, secretKey } = req.body;

  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, password, secretKey },
      { new: true }
    );
    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(updatedAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete admin profile
exports.deleteAdminProfile = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({ message: "Admin profile deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
