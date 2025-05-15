const mysql = require('mysql2');
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Piz@rro5530',
  database: process.env.DB_NAME || 'gestionrestaurantes',
  port: process.env.DB_PORT || 3306
});
db.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err.message);
  } else {
    console.log('MySQL conectado correctamente.');
  }
});
module.exports = db;