'use strict'

//importing dependecies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Message = require('./model/messages');

//creating instances
var app = express();
var router = express.Router();

//setting port to either a predetermined port number if it is set up, or 3001
var port = process.env.API_PORT || 3001;

//database config: mlab or heroukz
mongoose.connect('mongodb://heroku_4bmxrl83:9godqf0g2379qopkp0icuuj4n8@ds157521.mlab.com:57521/heroku_4bmxrl83', function(err) {
  if (err) {
    console.log(err);
  }else{
    console.log("Connected to DB"); 
  }
}
  );

//configuring the APi to use bodyParser and look for JSON data in the body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  //removing caching so we get the most recent messages
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//setting the route path & initializing the API
router.get('/', function(req, res) {
  res.json({ message: 'API Initialized!'});
});

//adding the /messages route to /api router
router.route('/messages')
  //retrieve all messages from the database
  .get(function(req, res) {
    //looks at Message Schema
    Message.find(function(err, messages) {
      if (err)
        res.send(err);
      //responds with a json object of database messages.
      res.json(messages)
    });
  })
  //post new message to the database
  .post(function(req, res) {
    var message = new Message();
    (req.body.author) ? message.author = req.body.author : null;
    (req.body.text) ? message.text = req.body.text : null;

    message.save(function(err) {
      if (err)
        res.send(err);
      res.json({ message: 'Message successfully added!' });
    });
  });

//Adding a route to a specific message based on the database ID
router.route('/messages/:message_id')
//The put method gives us the chance to update our message based on the ID passed to the route
  .put(function(req, res) {
    Message.findById(req.params.message_id, function(err, message) {
      if (err)
        res.send(err);
      //setting the new author and text to whatever was changed. If nothing was changed
      // field will not be altered.
      (req.body.author) ? message.author = req.body.author : null;
      (req.body.text) ? message.text = req.body.text : null;
      //save message
      message.save(function(err) {
        if (err)
          res.send(err);
        res.json({ message: 'Message has been updated' });
      });
    });
  })
  //delete method for removing a message from our database
  .delete(function(req, res) {
    //selects the message by its ID, then removes it.
    Message.remove({ _id: req.params.message_id }, function(err, message) {
      if (err)
        res.send(err);
      res.json({ message: 'message has been deleted' })
    })
  });

//uses router configuration when using /api
app.use('/api', router);

//starts the server and listens for requests
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});