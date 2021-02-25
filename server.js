require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const expressValidator = require('express-validator');
const app = express();
const exphbs  = require('express-handlebars');
const port = 3000
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');


// Cookie Parser ================================================================
app.use(cookieParser()); // Add this after you initialize express.

// Use Body Parser ==============================================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var checkAuth = (req, res, next) => {
	console.log("Checking authentication");
	if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
	  req.user = null;
	} else {
	  var token = req.cookies.nToken;
	  var decodedToken = jwt.decode(token, { complete: true }) || {};
	  req.user = decodedToken.payload;
	}
  
	next();
};

app.use(checkAuth);

// Routes =======================================================================
require('./controllers/posts.js')(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);

// Database Setup ===============================================================
require('./data/reddit-db.js');

// Add after body parser initialization!
app.use(expressValidator());

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.listen(port, function () {
	console.log(`express-handlebars example server listening on: ${port}`);
});

module.exports = app;