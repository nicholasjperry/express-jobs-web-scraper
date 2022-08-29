import { Application } from 'express';
import express from 'express';

const app: Application = express();
const PORT = 8000;
const jobRoutes = require('./routes/jobRoutes');
const userRoutes = require('./routes/userRoutes');
const userRoute = require('./routes/userRoute');

require('./db');
const { scrape } = require('./scrape.ts');

app.use(express.json());
app.use('/api', jobRoutes);
app.use('/api', userRoutes, userRoute);


app.listen(PORT, () => console.log(`The server is running on PORT: ${PORT}`));
scrape();