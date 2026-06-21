const bcrypt = require("bcrypt");
const mysql = require("mysql2");

// 🔌 Database connection (same as server.js)
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hospital"
});

db.connect((err) => {
    if (err) {
        console.log("DB Connection Error:", err);
    } else {
        console.log("MySQL Connected");
    }
});

// 🚀 Create Admin Function
async function createAdmin() {

    const username = "admin";
    const password = "admin123";
    const role = "admin";

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔍 Check if admin already exists
    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, result) => {

            if (err) {
                console.log("Error:", err);
                return;
            }

            if (result.length > 0) {
                console.log("⚠️ Admin already exists");
            } else {

                // 💾 Insert admin
                db.query(
                    "INSERT INTO users (username, password, role) VALUES (?,?,?)",
                    [username, hashedPassword, role],
                    (err) => {
                        if (err) {
                            console.log("Insert Error:", err);
                        } else {
                            console.log("✅ Admin created successfully");
                        }
                        process.exit();
                    }
                );
            }
        }
    );
}

createAdmin();