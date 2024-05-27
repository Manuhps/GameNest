require('dotenv').config(); // read environment variables from .env file
const cors = require('cors');       // middleware to enable CORS (Cross-Origin Resource Sharing)
const express = require('express');
const path = require('path');
const app = express();

app.use(cors()); //enable ALL CORS requests (client requests from other domain)

app.use(express.json()); //enable parsing JSON body data

app.use(express.static(path.join(__dirname, 'Front-end')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Front-end', 'index.html'));
});


app.use('/users', require('./routes/users.routes'))
app.use('/gameModes', require('./routes/gameModes.routes'))
app.use('/genres', require('./routes/genres.routes'))
app.use('/categories', require('./routes/categories.routes'))
app.use('/products', require('./routes/products.routes'))
app.use('/orders', require('./routes/orders.routes'))

app.listen(process.env.PORT, () => 
   console.log(`Server running at http://${process.env.HOST}:${process.env.PORT}/`)
);