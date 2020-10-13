const express = require('express');
const connectDB = require('./config/db');

const app = express();

connectDB();

const port = process.env.PORT || 4000;

app.use(express.json());

app.use('/api/users', require('./routes/users.route'));

app.listen(port, '0.0.0.0', () => {
    console.log(`Server working in port ${port}`);
});