const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const studentRoutes = require('./routes/studentRoutes');
const batchRoutes = require('./routes/batchRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/students', studentRoutes);
app.use('/api/batches', batchRoutes);

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
