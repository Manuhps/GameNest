require('dotenv').config(); // read environment variables from .env file
const express = require('express');


const app = express();

app.use(express.json()); //enable parsing JSON body data

app.listen(process.env.PORT, () => 
    console.log(`Server running at http://${process.env.DB_HOST}:${process.env.DB_PORT}/`)
);