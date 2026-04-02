const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "secret";

// ================= DB =================
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Kunalsood8858@',
  database: 'ecommerce_db'
});

// ================= FILE UPLOAD =================
const upload = multer({ dest: 'uploads/' });

// ================= AUTH =================

// Register
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashed],
      (err) => {
        if (err) return res.json({ message: "User already exists" });
        res.json({ message: "User registered successfully" });
      }
    );
  } catch {
    res.json({ message: "Server error" });
  }
});

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, result) => {

    if (err) return res.json({ message: "Server error" });

    if (result.length === 0) {
      return res.json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, result[0].password);

    if (!match) {
      return res.json({ message: "Wrong password" });
    }

    const token = jwt.sign({ id: result[0].id }, SECRET, {
      expiresIn: "1d"
    });

    res.json({ token });
  });
});

// ================= MIDDLEWARE =================

function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.json({ message: "Invalid token" });
  }
}

// ================= DATA =================

app.get('/total-sales', auth, (req, res) => {
  db.query(
    "SELECT SUM(sales) AS total FROM sales WHERE user_id=?",
    [req.user.id],
    (err, result) => {
      if (err) return res.json([]);
      res.json(result);
    }
  );
});

app.get('/total-profit', auth, (req, res) => {
  db.query(
    "SELECT SUM(profit) AS total FROM sales WHERE user_id=?",
    [req.user.id],
    (err, result) => {
      if (err) return res.json([]);
      res.json(result);
    }
  );
});

app.get('/sales-by-category', auth, (req, res) => {
  db.query(
    "SELECT category, SUM(sales) AS total FROM sales WHERE user_id=? GROUP BY category",
    [req.user.id],
    (err, result) => {
      if (err) return res.json([]);
      res.json(result);
    }
  );
});

app.get('/sales-by-region', auth, (req, res) => {
  db.query(
    "SELECT region, SUM(sales) AS total FROM sales WHERE user_id=? GROUP BY region",
    [req.user.id],
    (err, result) => {
      if (err) return res.json([]);
      res.json(result);
    }
  );
});

// ================= UPLOAD (FIXED) =================

app.post('/upload', auth, upload.single('file'), (req, res) => {

  if (!req.file) return res.json({ message: "No file uploaded" });

  // 🔥 STEP 1: Delete old data FIRST
  db.query("DELETE FROM sales WHERE user_id=?", [req.user.id], (err) => {

    if (err) return res.json({ message: "Error clearing old data" });

    // 🔥 STEP 2: Insert new CSV data
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => {

        const row = {
          row_id: data['Row ID'],
          order_id: data['Order ID'],
          order_date: data['Order Date'],
          ship_date: data['Ship Date'],
          ship_mode: data['Ship Mode'],
          customer_id: data['Customer ID'],
          customer_name: data['Customer Name'],
          segment: data['Segment'],
          country: data['Country'],
          city: data['City'],
          state: data['State'],
          postal_code: data['Postal Code'],
          region: data['Region'],
          product_id: data['Product ID'],
          category: data['Category'],
          sub_category: data['Sub-Category'],
          product_name: data['Product Name'],
          sales: data['Sales'],
          quantity: data['Quantity'],
          discount: data['Discount'],
          profit: data['Profit'],
          user_id: req.user.id
        };

        db.query('INSERT INTO sales SET ?', row);
      })
      .on('end', () => {

        // 🔥 STEP 3: delete uploaded file
        fs.unlinkSync(req.file.path);

        res.json({ message: "Upload success" });
      });

  });
});

// ================= SERVER =================

app.listen(5000, () => console.log("🚀 Server running on port 5000"));