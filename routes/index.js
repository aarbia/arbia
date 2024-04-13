var express = require('express');
var router = express.Router();
var path = require('path');

// Connect to process.env.DATABASE_URL when your app initializes:
// Read only reference value (const)
// get only Client class from pg package
const Client = require('pg').Client;

// create an instance from Client
const client = new Client({
  connectionString: process.env.DATABASE_URL
});

// connect to the DATABASE_URL
client.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//add new
router.get('/madlibs', function(req, res, next) {
  res.sendFile(path.join(__dirname,'..', 'public','madlibs.html'));
});

router.post('/madlibs', function(req, res) {
  //console.log (req.body);
  res.json({ 
    adjective1: req.body.adjective1,
    adjective2: req.body.adjective2,
    adjective3: req.body.adjective3,
    adverb: req.body.adverb,
    celebrity: req.body.celebrity,
    celebrity2: req.body.celebrity2,
    person: req.body.person,
    noun: req.body.noun,
    noun2: req.body.noun2,
    superlativeAdjective: req.body.superlativeAdjective
  });
});

router.get('/cars', function(req, res, next) {
  res.sendFile(path.join(__dirname,'..', 'public','cars.html'));
});

router.get('/carsOut', function(req, res, next) {
  // client object enables issuing SQL queries
  client.query('SELECT * FROM cars', function(err, result){
    if (err) {next(err);}
    res.json(result.rows);
    console.log(result.rows);
  });
});



module.exports = router;
