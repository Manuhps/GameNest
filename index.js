const express = require('express');
const app = express();
const host = process.env.HOST || '127.0.0.1' ; const port = process.env.PORT || 8080;

app.use(express.json()); //enable parsing JSON body data

// root route -- /api/
app.get('/', function (req, res) {
res.status(200).json({ message: 'home -- MOVIES api' });
});

// routing middleware for resource MOVIES
app.use('/movies', require('./routes/movies.routes.js'))

// handle invalid routes
app.all('*', function (req, res) {
res.status(404).json({ message: 'Not Found' });
})

app.listen(port, host, () => console.log(`App listening at http://${host}:${port}/`));