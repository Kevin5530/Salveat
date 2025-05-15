const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Piz@rro5530',
  database: 'gestionrestaurantes',
  port: 3306
});
db.connect(err => {
  if (err) throw err;
  console.log('MySQL conectado.');
});
module.exports = db;