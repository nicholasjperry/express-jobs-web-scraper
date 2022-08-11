const express = require('express');
const app = express();
const PORT = 8000;
const jobRoutes = require('./routes/jobRoutes');
const userRoutes = require('./routes/userRoutes');
const userRoute = require('./routes/userRoute');

require('./db');
const { scrape } = require('./utils/scrape');
scrape();

app.use(express.json());
app.use('/api', jobRoutes);
app.use('/', userRoutes, userRoute);


app.listen(PORT, () => console.log(`The server is running on PORT: ${PORT}`));