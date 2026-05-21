const verifyToken = require("../middleware/verifyToken");
const express = require("express");
const router = express.Router();
const db = require("../db");


// ========================
// GET ALL STUDENTS
// ========================
router.get("/", verifyToken, (req, res) => {
  const sql = "SELECT * FROM students";

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json(err);
      return;
    }

    res.json(result);
  });
});


// ========================
// GET SINGLE STUDENT
// ========================
router.get("/:id",verifyToken, (req, res) => {
  const sql = "SELECT * FROM students WHERE id = ?";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      res.status(500).json(err);
      return;
    }

    res.json(result);
  });
});


// ========================
// ADD STUDENT
// ========================
router.post("/" ,verifyToken, (req, res) => {
  const sql = `
    INSERT INTO students
    (student_id, name, gender, email, phone, department)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    req.body.student_id,
    req.body.name,
    req.body.gender,
    req.body.email,
    req.body.phone,
    req.body.department,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      res.status(500).json(err);
      return;
    }

    res.json({
      message: "Student added successfully",
    });
  });
});


// ========================
// UPDATE STUDENT
// ========================
router.put("/:id", verifyToken, (req, res) => {
  const sql = `
    UPDATE students
    SET
      student_id = ?,
      name = ?,
      gender = ?,
      email = ?,
      phone = ?,
      department = ?
    WHERE id = ?
  `;

  const values = [
    req.body.student_id,
    req.body.name,
    req.body.gender,
    req.body.email,
    req.body.phone,
    req.body.department,
    req.params.id,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      res.status(500).json(err);
      return;
    }

    res.json({
      message: "Student updated successfully",
    });
  });
});


// ========================
// DELETE STUDENT
// ========================
router.delete("/:id", verifyToken, (req, res) => {
  const sql = "DELETE FROM students WHERE id = ?";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      res.status(500).json(err);
      return;
    }

    res.json({
      message: "Student deleted successfully",
    });
  });
});

module.exports = router;