// Project 2 Index

const express = require('express');
const fs = require('fs');
const mysql = require('mysql');
const cors = require('cors');
const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
const connection = mysql.createConnection(credentials);

const service = express();
// service.options('*', (request, response) => {
//   response.set('Access-Control-Allow-Headers', 'Content-Type');
//   response.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
//   response.sendStatus(200);
// });
// service.use((request, response, next) => {
//   response.set('Access-Control-Allow-Origin', '*');
//   next();
// });
service.use(express.json());
service.use(cors());
connection.connect(error => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
});

// define endpoints...


function rowToReview(row) {
  return {
    id: row.id,
    coin: row.coin,
    quantity: row.quantity,
    fee: row.fee,
    volotility: row.volotility,
    price: row.price,
  };
}

// Sends report
service.get("/report.html", (req, res) => {
	res.sendFile(__dirname + "/report.html");
});

// SELECT statement
service.get('/trades/:coin', (request, response) => {
  const coin = request.params.coin;

  const query = 'SELECT * FROM trades WHERE coin = ? AND is_deleted = 0 ORDER BY price DESC';
  connection.query(query, [coin], (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      const trades = rows.map(rowToReview);
      response.json({
        ok: true,
        results: rows.map(rowToReview),
      });
    }
  });
});

// INSERT statement
service.post('/trades', (request, response) => {
  if (request.body.hasOwnProperty('coin') &&
      request.body.hasOwnProperty('quantity') &&
      request.body.hasOwnProperty('fee') &&
      request.body.hasOwnProperty('volotility') &&
      request.body.hasOwnProperty('price')) {

    const parameters = [
      request.body.coin,
      request.body.quantity,
      request.body.fee,
      request.body.volotility,
      request.body.price,
    ];
	
	const query = 'INSERT INTO trades(coin, quantity, fee, volotility, price) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, parameters, (error, result) => {
      if (error) {
        response.status(500);
        response.json({
          ok: false,
          results: error.message,
        });
      } else {
        response.json({
          ok: true,
          results: result.insertId,
        });
      }
    });

  } else {
    response.status(400);
    response.json({
      ok: false,
      results: 'Incomplete entry.',
    });
  }
});

// UPDATE statement
service.patch('/trades/:id', (request, response) => {
  const parameters = [
    request.body.coin,
    request.body.quantity,
    request.body.fee,
    request.body.volotility,
    request.body.price,
    parseInt(request.params.id),
  ];

  const query = 'UPDATE trades SET coin = ?, quantity = ?, fee = ?, volotility = ?, price = ? WHERE id = ?';
  connection.query(query, parameters, (error, result) => {
    if (error) {
	  response.status(404);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
      });
    }
  });
});

// (soft) DELETE statement
service.delete('/trades/:id', (request, response) => {
  const parameters = [parseInt(request.params.id)];

  const query = 'UPDATE trades SET is_deleted = 1 WHERE id = ?';
  connection.query(query, parameters, (error, result) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
      });
    }
  });
});

const port = 5001;
service.listen(port, () => {
  console.log(`We're live in port ${port}!`);
});
