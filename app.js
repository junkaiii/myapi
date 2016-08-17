//Loading dependencies - to go to config.js
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var app = express();

//loading mongoose
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
  .post(function(req, res, next){
    var new_member = new Member(req.body);
    new_member.save(function(err){
      if(err) return next(err);
      res.json(new_member);
    });
  });

  app.route('/actors/:actor_id')
    .get( function (req, res, next) {
      var member_id = req.params.member_id;
      Actor.findOne({
        _id: actor_id
      }, function (err, member) {
        if(err) return next(err);

        res.json(member);
      }
    );
  })
  .put( function(req, res, next) {
  var member_id = req.params.member_id;

  Member.findByIdAndUpdate( member_id, req.body, function(err, actor) {
    if(err) return next(err);

    res.json(member);
  });
});

//Selecting Ports
app.set('port', (process.env.PORT || 7000));

app.listen(app.get('port'), function() {
  console.log('Server is running at', app.get('port'));
});

module.exports = app;
