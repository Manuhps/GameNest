require('dotenv').config(); // read environment variables from .env file

const express = require('express');
const cors = require('cors'); // middleware to enable CORS (Cross-Origin Resource Sharing)

const app = express();
const port = process.env.PORT; // use environment variables
const host = process.env.HOST;

app.use(cors()); //enable ALL CORS requests (client requests from other domain)
app.use(express.json()); //enable parsing JSON body data

app.listen(port, host, () => console.log(`App listening at http://${host}:${port}/`));