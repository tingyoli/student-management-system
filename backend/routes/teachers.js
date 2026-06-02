const verifyToken = require("../middleware/verifyToken");
const express = require("express");
const router = express.Router();
const db = require("../db");

// 取得全部教師
router.get("/", verifyToken, (req, res) => {
  db.query("SELECT * FROM teachers", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// 新增教師
router.post("/", verifyToken, (req, res) => {
  const sql = `
    INSERT INTO teachers
    (teacher_id, name, gender, email, phone, department, title)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    req.body.teacher_id,
    req.body.name,
    req.body.gender,
    req.body.email,
    req.body.phone,
    req.body.department,
    req.body.title,
  ];

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Teacher added successfully" });
  });
});

// 刪除教師
router.delete("/:id", verifyToken, (req, res) => {
  db.query(
    "DELETE FROM teachers WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Teacher deleted successfully" });
    }
  );
});

module.exports = router;

router.put("/:id", verifyToken, (req, res) => {

  const sql = `
    UPDATE teachers
    SET
      teacher_id=?,
      name=?,
      gender=?,
      email=?,
      phone=?,
      department=?,
      title=?
    WHERE id=?
  `;

  db.query(
    sql,
    [
      req.body.teacher_id,
      req.body.name,
      req.body.gender,
      req.body.email,
      req.body.phone,
      req.body.department,
      req.body.title,
      req.params.id
    ],
    (err) => {

      if (err)
        return res.status(500).json(err);

      res.json({
        message: "Teacher updated successfully"
      });

    }
  );
});