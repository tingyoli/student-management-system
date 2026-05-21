const express = require("express");
const cors = require("cors");

require("./db");

const studentRoutes = require("./routes/students");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/students", studentRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Student Management API Running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});