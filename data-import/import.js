const fs = require('fs');
const csv = require('csv-parser');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Kunalsood8858@',
  database: 'ecommerce_db'
});

const results = [];

fs.createReadStream('Sample - Superstore.csv')
  .pipe(csv())
  .on('data', (data) => {
    const formattedData = {
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
      profit: data['Profit']
    };

    results.push(formattedData);
  })
  .on('end', () => {
    results.forEach(row => {
      connection.query('INSERT INTO sales SET ?', row, (err) => {
        if (err) console.log(err);
      });
    });

    console.log("Data inserted successfully!");
  });