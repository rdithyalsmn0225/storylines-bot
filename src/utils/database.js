const mysql = require("mysql");

// MySQL Connection:
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) return console.log(err);
    console.log(`MySQL has been connected!`);
});

module.exports = db;
