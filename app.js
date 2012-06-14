var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require('mongoose');

var app = express.createServer();

// Database

mongoose.connect('mongodb://localhost/ecomm_database');

// Config

app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


// Routes

app.get('/api', function (req, res) {
  res.send('Cardsharp API is running');
});

// Test code

app.get('/', function(request, response) {
  response.send('Card Sharp landing page!');
});


// Launch server

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
