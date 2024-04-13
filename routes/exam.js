var express = require('express');
var router = express.Router();

var path = require('path');
var env = require('dotenv').config();

const Client = require('pg').Client;
const client = new Client({
  connectionString: process.env.DATABASE_URL
}); 
client.connect(); // connect to the DATABASE_URL

var passport = require('passport');
var bcrypt = require('bcryptjs');

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) {
      console.log("unable to logout:", err);
      return next(err);
    }
  });   //passport provide it
  res.redirect('/exam'); // Successful. redirect to localhost:3000/exam
}); 

// localhost:3000/exam
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname,'..', 'public','exam.html'));
});

// localhost:3000/exam
router.post('/',
  // depends on the fields "isAdmin", redirect to the different path: admin or notAdmin
  passport.authenticate('local', { failureRedirect: 'exam?message=Incorrect+credentials', failureFlash:true }),
  function(req, res, next) {
    console.log
    if (req.user.isadmin == 'admin'){
      res.redirect('/exam/admin');
    }
    else {
      res.redirect('/exam/notAdmin');
    }
});

// localhost:3000/exam/admin
router.get('/admin', function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public','admin.html'));
});

router.get('/notAdmin',function(req, res, next){
  res.sendFile(path.join(__dirname,'..', 'public','notAdmin.html'));
});

router.get('/notAdminOut',function(req, res, next){
  client.query('SELECT * FROM assignment WHERE username=$1',[req.user.username], function(err,result){
    if (err) {
      console.log("exam.js: sql error ");
      next(err); // throw error
    }
    else if (result.rows.length > 0) {
      console.log("There is at least one assignment ");
      res.json(result.rows);
    }
    else{
      console.log("This student does not have any assignment");
      let username=req.user.username;
      res.redirect('/exam/notAdmin?message='+username+" does not exist");
    }
  });
});

router.get('/whoami',function(req,res,next) {
  res.json({"user": req.user.username});
});

router.get('/addAssignment',function(req, res, next) {
  res.sendFile(path.join(__dirname,'..', 'public','addAssignment.html'));
});

router.post('/addAssignment',function(req, res, next) {
  client.query('SELECT * FROM examusers WHERE username = $1', [req.body.username], function(err, result) {
    if (err) {
      console.log("unable to query SELECT");
      next(err);
    }
    if (result.rows.length > 0) {
        console.log("User exist. Let's add assignment");
        client.query('INSERT INTO assignment (username, description, due) VALUES($1, $2, $3)', [req.body.username, req.body.description,req.body.due], function(err, result) {
          if (err) {
            console.log("unable to query INSERT");
            next(err);
          }
          console.log("Assignment creation is successful");
          res.redirect('/exam/addAssignment?message=Created+assignment+successfully');
        });
    }
    else {
      console.log("user doesn't exist");
      res.redirect('/exam/addAssignment?message=User+does+not+exist');
    }
  });
});

router.get('/changePassword',function(req, res, next) {
  res.sendFile(path.join(__dirname,'..', 'public','changePassword.html'));
});

function changePassword(req, res, next){
  var salt = bcrypt.genSaltSync(10);
  var newPassword = bcrypt.hashSync(req.body.newPassword, salt);

  console.log("passwords match, lets change");
  client.query('UPDATE examusers set password=$1 where username=$2', [newPassword, req.user.username], function(err, result) {
    if (err) {
      console.log("unable to query UPDATE");
      return next(err); // throw error to error.hbs.
    }
    console.log("Passowrd change successful");
    res.redirect('/exam/changePassword?message=You+successfully+changed+password!');
  });
}

router.post('/changePassword', function(req, res, next) {
  client.query('SELECT * FROM examusers WHERE username = $1 AND password = $2', [req.user.username, req.user.password], function(err, result) {
    if (err) {
      console.log("unable to query SELECT");
      next(err);
    }
    var userPassword =  result.rows[0];
    if (result.rows.length > 0) {
      let matched = bcrypt.compareSync(req.body.password, userPassword.password);
      if (!matched) {
        console.log("incorrect password");
        res.redirect('/exam/changePassword?message=Current+password+does+not+match');
      } 
    
      else if (req.body.newPassword != req.body.newPasswordConfirm){
        console.log("two passwords are not the same");
        res.redirect('/exam/changePassword?message=The+two+passwords+you+entered+are+not+the+same');
      }
      else{
        console.log("passwords match, lets change");
        changePassword(req, res, next);
      }
    }
  });
});

router.get('/addUser',function(req, res, next) {
  res.sendFile(path.join(__dirname,'..', 'public','addUser.html'));
});

function createUser(req, res, next){
  var salt = bcrypt.genSaltSync(10);
  var password = bcrypt.hashSync(req.body.password, salt);

  client.query('INSERT INTO examusers (username, password, isAdmin) VALUES($1, $2, $3)', [req.body.username, password,req.body.isAdmin], function(err, result) {
    if (err) {
      console.log("unable to query INSERT");
      return next(err); // throw error to error.hbs.
    }
    console.log("User creation is successful");
    res.redirect('/exam/addUser?message=We+created+your+account+successfully!');
  });
}

router.post('/addUser',function(req, res, next) {
  client.query('SELECT * FROM examusers WHERE username=$1',[req.body.username], function(err,result){
    if (err) {
      console.log("sql error ");
      next(err); // throw error to error.hbs.
    }
    else if (result.rows.length > 0) {
      console.log("user exists");
      res.redirect('/exam/addUser?message=User+exists');
    }
    else {
      console.log("no user with that name");
      createUser(req, res, next);
    }
  });
});

module.exports = router;