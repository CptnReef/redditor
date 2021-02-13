"use strict";

const express = require('express');
const exphbs  = require('express-handlebars');
const app = express();
const port = 3000

 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
 
app.get('/', function (req, res) {
    res.send('Hello World!')
    res.render('home');
});

app.listen(port, function () {
	console.log(`express-handlebars example server listening on: ${port}`);
});