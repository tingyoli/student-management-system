const mysql = require("mysql2");


const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tim33624135",
  database: "student_management",
});

connection.connect((err) => {
  if (err) {
    console.log("資料庫連線失敗");
    console.log(err);
    return;
  }

  console.log("MySQL 連線成功");
});

module.exports = connection;
