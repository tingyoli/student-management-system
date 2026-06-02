require("dotenv").config();
require("./db");

const express = require("express");
const cors = require("cors");
const studentRoutes = require("./routes/students");
const authRoutes = require("./routes/auth");
const teacherRoutes = require("./routes/teachers");
const courseRoutes = require("./routes/courses");
const enrollmentRoutes = require("./routes/enrollments");



const app = express();

app.use(cors());
app.use(express.json());

app.use("/students", studentRoutes);
app.use("/auth", authRoutes);
app.use("/teachers", teacherRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes);

app.get("/", (req, res) => {
  res.send("Student Management API Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

