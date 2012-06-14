// Requires
var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require('mongoose');

var app = express.createServer();

// Database
mongoose.connect('mongodb://heroku_app5235183:osnln2uihco341kvcv37dn7rak@ds033897.mongolab.com:33897/heroku_app5235183');

// Config
app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Launch server
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});



// Schema
var Schema = mongoose.Schema;  

var Product = new Schema({  
    title: { type: String, required: true },  
    description: { type: String, required: true },  
    style: { type: String, unique: true },  
    modified: { type: Date, default: Date.now }
});

var Benefit = new Schema({
    detail: { type: String}  
});

var Card = new Schema({  
    name: { type: String, required: true, unique: true  },  
    type: { type: String, required: true },
    minRate: { type: Number, required: false },              
    maxRate: { type: Number, required: false },
    introRate: { type: Number, required: false },      
    introMonths: { type: Number, required: false },
    benefits: [Benefit],                                    
    modified: { type: Date, default: Date.now }
});


var ProductModel = mongoose.model('Product', Product);  
var CardModel = mongoose.model('Card', Card);  

// API Routes
app.get('/api', function (req, res) {
  res.send('Card Sharp API is running');
});

// Products API CRUD
app.get('/api/products', function (req, res){
  return ProductModel.find(function (err, products) {
    if (!err) {
      return res.send(products);
    } else {
      return console.log(err);
    }
  });
});

app.post('/api/products', function (req, res){
  var product;
  console.log("POST: ");
  console.log(req.body);
  product = new ProductModel({
    title: req.body.title,
    description: req.body.description,
    style: req.body.style,
  });
  product.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(product);
});

app.get('/api/products/:id', function (req, res){
  return ProductModel.findById(req.params.id, function (err, product) {
    if (!err) {
      return res.send(product);
    } else {
      return console.log(err);
    }
  });
});

app.delete('/api/products/:id', function (req, res){
  return ProductModel.findById(req.params.id, function (err, product) {
    return product.remove(function (err) {
      if (!err) {
        console.log("removed");
        return res.send('');
      } else {
        console.log(err);
      }
    });
  });
});

// Card API CRUD

// get cards
app.get('/api/cards', function (req, res){
  return CardModel.find(function (err, cards) {
    if (!err) {
      return res.send(cards);
    } else {
      return console.log(err);
    }
  });
});

// add card
app.post('/api/cards', function (req, res){
  var card;
  console.log("POST: ");
  console.log(req.body);
  card = new CardModel({
    name: req.body.name,
    type: req.body.type,
    minRate: req.body.minRate,
    maxRate: req.body.maxRate,
    introRate: req.body.introRate,
    introMonths: req.body.introMonths,
    benefits: req.body.benefits,    
  });
  card.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(card);
});

// get card
app.get('/api/cards/:id', function (req, res){
  return CardModel.findById(req.params.id, function (err, card) {
    if (!err) {
      return res.send(card);
    } else {
      return console.log(err);
    }
  });
});

// update card
app.put('/api/cards/:id', function (req, res){
  return CardModel.findById(req.params.id, function (err, card) {
    card.name = req.body.name;
    card.description = req.body.description;    
    card.type =  req.body.type;
    card.minRate = req.body.minRate;
    card.maxRate = req.body.maxRate;
    card.introRate =req.body.introRate;
    card.introExpiration = req.body.introExpiration;
    card.benefits = req.body.benefits;
    return product.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(card);
    });
  });
});


// delete
app.delete('/api/cards/:id', function (req, res){
  return CardModel.findById(req.params.id, function (err, card) {
    return card.remove(function (err) {
      if (!err) {
        console.log("removed");
        return res.send('');
      } else {
        console.log(err);
      }
    });
  });
});



