const verifyToken = require("../middleware/verifyToken");
const express = require("express");
const router = express.Router();
const db = require("../db");

// 取得全部課程
router.get("/", verifyToken, (req, res) => {
  const sql = `
    SELECT 
      courses.*,
      teachers.name AS teacher_name
    FROM courses
    LEFT JOIN teachers
    ON courses.teacher_id = teachers.teacher_id
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.json(result);
  });
});

// 新增課程
router.post("/", verifyToken, (req, res) => {
  const sql = `
    INSERT INTO courses
    (course_id, course_name, teacher_id, credits, classroom)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [
    req.body.course_id,
    req.body.course_name,
    req.body.teacher_id,
    req.body.credits,
    req.body.classroom,
  ];

  db.query(sql, values, (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          message: "課程代碼已存在",
        });
      }

      return res.status(500).json({
        message: err.message,
      });
    }

    res.json({
      message: "課程新增成功",
    });
  });
});

// 刪除課程
router.delete("/:id", verifyToken, (req, res) => {
  db.query(
    "DELETE FROM courses WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        message: "課程刪除成功",
      });
    }
  );
});

module.exports = router;