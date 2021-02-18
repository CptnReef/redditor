const express = require('express');
const bodyParser = require('body-parser')
const expressValidator = require('express-validator');
const app = express();
const exphbs  = require('express-handlebars');
const port = 3000


// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes =======================================================================
require('./controllers/posts.js')(app);

// Database Setup ===============================================================
require('./data/reddit-db.js');

// Add after body parser initialization!
app.use(expressValidator());

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/posts/new', (req, res) => {
    return res.render('posts/new/posts-new');
});

app.listen(port, function () {
	console.log(`express-handlebars example server listening on: ${port}`);
});

module.exports = app;