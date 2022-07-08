const express = require('express');
const bodyParser = require('body-parser');

const PORT = 8000;
const app = express();

require('./utils/scrape');

// Parse results 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Express app listening on port 8000
app.listen(PORT, () => console.log(`The server is running on PORT: ${PORT}`));

