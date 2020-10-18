const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

connectDB();

app.use(cors({
    origin: process.env.CLIENT_URL
}));

const port = process.env.PORT || 4000;

app.use(express.json());

// Habilitar carpeta pública
app.use(express.static('uploads'));

app.use('/api/users', require('./routes/users.route'));
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/link', require('./routes/link.route'));
app.use('/api/files', require('./routes/files.route'));

app.listen(port, '0.0.0.0', () => {
    console.log(`Server working in port ${port}`);
});