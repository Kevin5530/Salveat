const express = require('express');
const cors = require('cors');
const app = express();
const ordenRoutes = require('./routes/orden');
const clientes = require('./routes/clientes');
const restauranteRoutes = require('./routes/restaurante');

app.use(cors());
app.use(express.json());

app.use('/api/orden', ordenRoutes);
app.use('/api/clientes', clientes);
app.use('/api/restaurante', restauranteRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});