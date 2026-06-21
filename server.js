const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ================= MYSQL CONNECTION =================
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hospital"
});

db.connect(err => {
    if (err) console.log("DB Error:", err);
    else console.log("MySQL Connected");
});


// ================= LOGIN =================
const bcrypt = require("bcrypt");

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE username=?",
        [username],
        async (err, result) => {

            if (err) return res.json({ success: false });

            if (result.length === 0) {
                return res.json({ success: false });
            }

            const user = result[0];

            const match = await bcrypt.compare(password, user.password);

            if (match) {
                res.json({
                    success: true,
                    user: {
                        id: user.id,
                        username: user.username,
                        role: user.role
                    }
                });
            } else {
                res.json({ success: false });
            }
        }
    );
});



















// ================= DOCTORS =================
app.get("/doctors", (req, res) => {
    db.query("SELECT * FROM doctors", (err, result) => {
        if (err) return res.json([]);
        res.json(result || []);
    });
});

app.post("/doctors", (req, res) => {
    const { name, specialization, phone, email, timing } = req.body;

    db.query(
        "INSERT INTO doctors (name, specialization, phone, email, timing) VALUES (?,?,?,?,?)",
        [name, specialization, phone, email, timing],
        (err) => {
            if (err) return res.json(err);
            res.json({ message: "doctor saved" });
        }
    );
});


// ================= APPOINTMENTS =================
app.get("/appointments", (req, res) => {
    db.query("SELECT * FROM appointments", (err, result) => {
        if (err) return res.json([]);
        res.json(result || []);
    });
});

app.post("/appointments", (req, res) => {
    const { patient, doctor, date, time } = req.body;

    db.query(
        "INSERT INTO appointments (patient_name, doctor_name, date, time) VALUES (?,?,?,?)",
        [patient, doctor, date, time],
        (err) => {
            if (err) return res.json(err);
            res.json({ message: "saved" });
        }
    );
});

app.put("/appointments/:id", (req, res) => {
    const { patient, doctor, date, time } = req.body;

    db.query(
        "UPDATE appointments SET patient_name=?, doctor_name=?, date=?, time=? WHERE id=?",
        [patient, doctor, date, time, req.params.id],
        (err) => {
            if (err) return res.json(err);
            res.json({ message: "updated" });
        }
    );
});

app.delete("/appointments/:id", (req, res) => {
    db.query(
        "DELETE FROM appointments WHERE id=?",
        [req.params.id],
        (err) => {
            if (err) return res.json(err);
            res.json({ message: "deleted" });
        }
    );
});


// ================= PATIENTS =================
app.get("/patients", (req, res) => {
    db.query("SELECT * FROM patients", (err, result) => {
        if (err) return res.json([]);
        res.json(result || []);
    });
});

app.post("/patients", (req, res) => {
    const { name, age, phone, disease } = req.body;

    db.query(
        "INSERT INTO patients (name, age, phone, disease) VALUES (?,?,?,?)",
        [name, age, phone, disease],
        (err) => {
            if (err) return res.json(err);
            res.json({ message: "patient saved" });
        }
    );
});

app.put("/patients/:id", (req, res) => {
    const { name, age, phone, disease } = req.body;

    db.query(
        "UPDATE patients SET name=?, age=?, phone=?, disease=? WHERE id=?",
        [name, age, phone, disease, req.params.id],
        (err) => {
            if (err) return res.json(err);
            res.json({ message: "updated" });
        }
    );
});

app.delete("/patients/:id", (req, res) => {
    db.query(
        "DELETE FROM patients WHERE id=?",
        [req.params.id],
        (err) => {
            if (err) return res.json(err);
            res.json({ message: "deleted" });
        }
    );
});


// ================= BILLS =================
app.get("/bills", (req, res) => {
    db.query("SELECT * FROM bills", (err, result) => {
        if (err) return res.json([]);
        res.json(result || []);
    });
});

app.post("/bills", (req, res) => {
    const { name, amount } = req.body;

    db.query(
        "INSERT INTO bills (name, amount) VALUES (?,?)",
        [name, amount],
        (err) => {
            if (err) return res.json(err);
            res.json({ message: "saved" });
        }
    );
});


// ================= SERVER START =================
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
