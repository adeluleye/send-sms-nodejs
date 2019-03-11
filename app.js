const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

const nexmo = new Nexmo({
    apiKey: 'API_KEY',
    apiSecret: 'API_SECRET'
  })

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

// Catch form submit
app.post('/', (req, res) => {
    const from = 'Nexmo';
    const number = req.body.number;
    const text = req.body.text;

    nexmo.message.sendSms(
        from, number, text, { type: 'unicode' },
        (err, responseData) => {
            if(err) {
                console.log(err);
            } else {
                console.dir(responseData);
                // Get data from response
                const data = {
                    id: responseData.messages[0]['message-id'],
                    number: responseData.messages[0]['to']
                }

                // Emit to the client
                io.emit('smsStatus', data)
            }
        }
    );
});

// Define port
const port = 3000;

// Start server
const server = app.listen(port, 
    () => console.log(`app started on port ${port}`))

// Connect to socket.io
const io = socketio(server);
io.on('connection', (socket) => {
    console.log('Connected');
    io.on('disconnect', () => {
        console.log('Disconnected');
    })
})