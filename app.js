const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

// Initailize app
const app = express();

// Template engine setup
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// Public folder setup
app.use(express.static(__dirname + '/public'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// create a route
app.get('/', (req, res) => {
    res.render('index');
})

// Define port
const port = 3000;

// Start server
const server = app.listen(port, 
    () => console.log(`app started on port ${port}`))