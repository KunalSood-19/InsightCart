# InsightCart

Cartlytics is a full-stack web application that allows users to upload e-commerce CSV data and visualize key business insights such as total sales, profit, and category-wise performance using interactive charts.

---

## 🚀 Features

- 🔐 User Authentication (Login & Register using JWT)
- 📁 Upload CSV file
- 📊 Dynamic Dashboard with Charts (Chart.js)
- 💰 Total Sales & Profit Calculation
- 🛍 Category-wise Sales Analysis
- 🌍 Region-based Analytics
- 👤 User-specific data (each user sees only their own data)
- 🎨 Modern UI (Dark Theme + Glassmorphism)

---

## 🛠 Tech Stack

### Frontend
- HTML
- CSS
- JavaScript
- Chart.js

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Libraries Used
- Multer (file upload)
- csv-parser (CSV processing)
- bcrypt (password hashing)
- jsonwebtoken (authentication)

---

## 📂 Folder Structure

InsightCart/
│
├── frontend/
│ ├── login.html
│ ├── signup.html
│ ├── index.html
│ ├── styles.css
│ ├── script.js
│ ├── login.js
│ ├── signup.js
│
├── backend/
│ ├── server.js
│ ├── package.json
│
├── uploads/
│
├── README.md
├── .gitignore


---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

git clone https://github.com/your-username/cartlytics.git

cd cartlytics


---

### 2️⃣ Install backend dependencies

cd backend
npm install


---

### 3️⃣ Setup MySQL Database

Create database:

CREATE DATABASE ecommerce_db;


Create tables:


CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
email VARCHAR(255),
password VARCHAR(255)
);

CREATE TABLE sales (
id INT AUTO_INCREMENT PRIMARY KEY,
row_id INT,
order_id VARCHAR(50),
order_date VARCHAR(50),
ship_date VARCHAR(50),
ship_mode VARCHAR(50),
customer_id VARCHAR(50),
customer_name VARCHAR(255),
segment VARCHAR(50),
country VARCHAR(50),
city VARCHAR(50),
state VARCHAR(50),
postal_code VARCHAR(20),
region VARCHAR(50),
product_id VARCHAR(50),
category VARCHAR(50),
sub_category VARCHAR(50),
product_name VARCHAR(255),
sales FLOAT,
quantity INT,
discount FLOAT,
profit FLOAT,
user_id INT
);


---

### 4️⃣ Run backend server

node server.js


Server runs on:

http://localhost:5000


---

### 5️⃣ Run frontend

Open:

frontend/login.html

in your browser.

---

## 📊 How It Works

1. User registers or logs in  
2. JWT token is generated and stored  
3. User uploads CSV file  
4. Backend parses file and stores data in MySQL  
5. Dashboard fetches data via APIs  
6. Charts display analytics (sales, profit, categories)

---

## 📈 Dashboard Insights

- Total Sales
- Total Profit
- Number of Orders
- Category-wise sales (Bar + Pie charts)
