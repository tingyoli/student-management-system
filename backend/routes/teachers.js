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
    if(err.code === "ER_DUP_ENTRY") {

      if (err.sqlMessage.includes("unique_teacher_id")) {
      return res.status(400).json({ message: "教師編號已存在" });
    }
      if (err.sqlMessage.includes("unique_teacher_email")) {
      return res.status(400).json({ message: "Email 已存在" });
    }
    if (err) return res.status(400).json(
      { 
        message: "新增教師失敗，請檢查輸入資料是否正確" 
      });
      return res.status(500).json(
      { message: "伺服器錯誤，請稍後再試" }
    );
    }
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