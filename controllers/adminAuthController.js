const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Admin = require("../models/Admin");

// Admin signup
exports.adminSignup = async (req, res) => {
  const { name, email, phone, password, secretKey } = req.body;

  if (secretKey !== process.env.JWT_SECRET) {
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

    const payload = {
      admin: {
        id: admin.id,
        role: "admin",
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Admin login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    let admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const payload = {
      admin: {
        id: admin.id,
        role: "admin",
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            secretkey: admin.secretKey,
            phone: admin.phone,
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
