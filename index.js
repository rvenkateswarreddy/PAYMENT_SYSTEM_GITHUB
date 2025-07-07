const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student");
const nodemailer = require("nodemailer");
require("dotenv").config();
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const Category = require("./models/Category");
const Fee = require("./models/Fee");
const Payment = require("./models/Payment");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-auth-token",
      "y-auth-token",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());
// Connect to MongoDBa
connectDB();

app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/students", require("./routes/students"));
app.use("/api/fees", require("./routes/fees"));
app.use("/api", require("./routes/paymentRoutes"));
app.use("/api/category", require("./routes/categoryRoutes"));

app.use("/api/events", require("./routes/eventRoutes"));
// app.use("/api/courses", require("./routes/courses"));
// app.use("/api/payments", require("./routes/payments"));
// app.use("/api/courses", require("./routes/courses"));
// app.use("/api/reports", require("./routes/reports"));
// BlogPost Schema
const blogPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

// Routes
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await BlogPost.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/posts", async (req, res) => {
  const post = new BlogPost({
    title: req.body.title,
    content: req.body.content,
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/posts/:id", async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get("/api/student/:admissionNo", async (req, res) => {
  try {
    const student = await Student.findOne({
      admissionNo: req.params.admissionNo,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const payments = await Payment.find({ studentpaymentid: student._id });
    const fees = await Fee.find({ studentfeeId: student._id }).populate(
      "categoryId"
    );

    res.json({ student, payments, fees });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post("/send-email", async (req, res) => {
  const { user_name, user_email, message } = req.body;

  // Configure the transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail", // You can use any email service (e.g., Gmail, Outlook)
    auth: {
      user: "vijaykumargokulkumar@gmail.com", // Your email address
      pass: "hjlk vkxa wksv pgqr", // Your email password or app password
    },
  });

  // Email options
  const mailOptions = {
    from: user_email,
    to: "vijaykumargokulkumar@gmail.com", // Recipient email address
    subject: `New Contact Form Submission from ${user_name}`,
    text: `Name: ${user_name}\nEmail: ${user_email}\n\nMessage:\n${message}`,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email." });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
