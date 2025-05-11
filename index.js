const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const SensorData = require('./models/SensorData');
const cors = require('cors');

const app = express();
const PORT = 4000; 

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/pi-4-dsm', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to PI-4 Backend');
});

// Route to insert data
app.post('/data', async (req, res) => {
  try {
    const sensorData = new SensorData(req.body);
    await sensorData.save();
    res.status(201).send(sensorData);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Route to fetch all data
app.get('/data', async (req, res) => {
  try {
    const sensorData = await SensorData.find();
    res.status(200).send(sensorData);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Route to delete data by ID
app.delete('/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedData = await SensorData.findByIdAndDelete(id);
    if (!deletedData) {
      return res.status(404).send({ error: 'Data not found' });
    }
    res.status(200).send({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
