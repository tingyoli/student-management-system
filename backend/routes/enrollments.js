const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyToken = require("../middleware/verifyToken");

// 取得所有選課資料
router.get("/", verifyToken, (req, res) => {
  const sql = `
    SELECT
      e.id,
      s.student_id,
      s.name AS student_name,
      c.course_id,
      c.course_name
    FROM enrollments e
    JOIN students s
      ON e.student_id = s.student_id
    JOIN courses c
      ON e.course_id = c.course_id
    ORDER BY s.student_id
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

// 新增選課
router.post("/", verifyToken, (req, res) => {
  const sql = `
    INSERT INTO enrollments
    (student_id, course_id)
    VALUES (?, ?)
  `;

  db.query(
    sql,
    [req.body.student_id, req.body.course_id],
    (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            message: "該學生已選過此課程",
          });
        }

        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        message: "選課新增成功",
      });
    }
  );
});

// 刪除選課
router.delete("/:id", verifyToken, (req, res) => {
  const sql = "DELETE FROM enrollments WHERE id = ?";

  db.query(sql, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.json({
      message: "選課刪除成功",
    });
  });
});

module.exports = router;