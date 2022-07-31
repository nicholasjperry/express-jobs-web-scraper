const mongoose = require('mongoose');
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
    );
// Store connection in variable db and log successful connection to console
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));

module.exports = db;