const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const db = require("../db");


// LOGIN
router.post("/login", (req, res) => {

  const { username, password } = req.body;

  const sql = `
    SELECT * FROM users
    WHERE username = ?
  `;

  db.query(sql, [username], (err, result) => {

    if (err) {
  console.log("Login SQL error:", err);

  res.status(500).json({
    message: "資料庫查詢失敗",
    error: err.message,
  });

  return;
}

    if (result.length === 0) {

      res.status(401).json({
        message: "帳號不存在",
      });

      return;

    }

    const user = result[0];

    // 簡單版密碼驗證
    if (password !== user.password) {

      res.status(401).json({
        message: "密碼錯誤",
      });

      return;

    }

    // JWT Token
    const token = jwt.sign(

      {
        id: user.id,
        username: user.username,
      },

      "secretkey",

      {
        expiresIn: "1h",
      }

    );

    res.json({

      message: "登入成功",

      token,

    });

  });

});

module.exports = router;