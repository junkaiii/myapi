//Loading dependencies - to go to config.js
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var app = express();

//loading mongoose
var jwt_secret = 'supercalifragilisticexpialidocious';
var mongo_url = process.env.MONGODB_URI || 'mongodb://localhost/mymdb_db';
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(mongo_url);

//enable body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


//linking models
var Member = require('./models/member');


//Enable Cross Origin Requests
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//creating routes
app.route('/members')
  .get(function(req, res) {
    Member.find({}).exec(function(err, members) {
      if (err) return next(err);
      res.json(members);
    });
  })
  .post(function(req, res, next) {
    var new_member = new Member(req.body);
    new_member.save(function(err) {
      if (err) return next(err);
      res.json(new_member);
    });
  });

app.route('/members/:member_id')
  .get(function(req, res, next) {
    var member_id = req.params.member_id;
    Actor.findOne({
      _id: member_id
    }, function(err, member) {
      if (err) return next(err);

      res.json(member);
    });
  })
  .put(function(req, res, next) {
    var member_id = req.params.member_id;

    Member.findByIdAndUpdate(member_id, req.body, function(err, actor) {
      if (err) return next(err);

      res.json(member);
    });
  });

  // signup route
  app.post('/signup', function(req, res) {
    // set var for the posted requests
    var member_object = req.body;
    // set new User object
    var new_member = new Member(member_object);
    // save new User object
    new_user.save(function(err, user) {
      if (err) return res.status(400).send(err);
      return res.status(200).send({
        message: 'User Created'
      });
    });
  });

  // //login route
  // app.post('/login', function(req, res) {
  //   // res.send('login here');
  //   var member_object = req.body;
  //   console.log(member_object.email);
  //   Member.findOne({ email: req.body.email, password: req.body.password }, function(err, member) {
  //     if (err) return res.status(400).send('Invalid request');
  //     return res.status(200).send(member);
  //   });
  // });

  //login route
  app.post('/login', function(req, res){
    var loggedin_member = req.body;

    Member.findOne(
      loggedin_member, //must requested object match all the parameters in the database?
      function(err, found_member) {
        if (err) return res.status(400).send(err);

        if (found_member) {
          var payload = {
            id: found_member.id,
            email: found_member.email
          };
          var expiryObj = {
            exp: 60 * 3 //what does this mean?
          };
          console.log (payload, expiryObj, jwt_secret);
          var jwt_token = jwt.sign(payload, jwt_secret, { expiresIn : 60*3 });
          return res.status(200).send(jwt_token); //why do we want to return the token? whats the use?
        } else {
          return res.status(400).send({
            message: 'login failed'
          });
        }
      }
    );
  });

//Selecting Ports
app.set('port', (process.env.PORT || 7000));

app.listen(app.get('port'), function() {
  console.log('Server is running at', app.get('port'));
});

module.exports = app;
