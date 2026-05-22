const mysql = require("mysql2");

const db = mysql.createConnection({

  host: process.env.DB_HOST,

  user: process.env.DB_USER,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_NAME,

  port: process.env.DB_PORT,

});

db.connect((err) => {

  if (err) {

    console.log("資料庫連線失敗");
    console.log(err);
    return;

  }

  console.log("MySQL 連線成功");

});

module.exports = db;
