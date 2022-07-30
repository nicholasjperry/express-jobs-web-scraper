const express = require('express');
const mongoose = require('mongoose');
const jobRoutes = require('./routes/jobRoutes');
const route = require('./routes/route');
const userRoutes = require('./routes/userRoutes');
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Connect to db via env variable
mongoose
    .connect(process.env.MONGODB_URI, 
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
    .then(() => {
        const app = express();
        const PORT = 8000;
        app.use(express.json());
        app.use('/api', jobRoutes);
        app.use('/', userRoutes, route);

        app.listen(PORT, () => console.log(`The server is running on PORT: ${PORT}`));
    });
// Store connection in variable db and log successful connection to console
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));

module.exports = db;