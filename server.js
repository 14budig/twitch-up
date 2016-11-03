var express = require('express');
var request = require('request');
var app = express();

var mongoose = require("mongoose");

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const crypto = require('crypto');

function encrypt(text){
  var cipher = crypto.createCipher(process.env.CIPHER_ALG, process.env.CIPHER_PSWD)
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var decipher = crypto.createDecipher(process.env.CIPHER_ALG, process.env.CIPHER_PSWD)
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}

var db = require('./models');

app.use(session({
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({url: "mongodb://localhost/twitch-up"}),
    resave: true,
    saveUninitialized: false
}));


var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.use('/vendor', express.static(__dirname + '/bower_components'));

app.get('/', function homepage(req, res) {
  var sess = req.session;
  console.log(sess);
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/templates/:name', function templates(req, res) {
  var name = req.params.name;
  res.sendFile(__dirname + '/views/templates/' + name + '.html');
});

app.get('/oauth', function(req,res){
  var sess = req.session;
  if(req.query.code){
    request.post('https://api.twitch.tv/kraken/oauth2/token', {form:{client_id: process.env.APP_ID, client_secret: process.env.APP_SECRET, grant_type: 'authorization_code', redirect_uri:'http://localhost:3000/oauth', code: req.query.code}}, function(err, response, body){
      body = JSON.parse(body);
      request.get({url: 'https://api.twitch.tv/kraken/user', headers:  {'Accept': 'application/vnd.twitchtv.v3+json', 'Authorization':'OAuth '+body.access_token, 'Client-ID': process.env.APP_ID}}, function(err, response, body2){
        body2 = JSON.parse(body2);
        db.User.findOne({name: body2.name}, function(err, user){
          if(!user){
            var key = encrypt(body.access_token);
            console.log(body.access_token, key);
            db.User.create({name: body2.name, key: key, scopes: body.scope},function(err, user){
              sess.name=user.name;
              res.sendFile(__dirname + '/views/index.html');
              res.cookie('name', sess.name);
            });
          }
          else{
            sess.name=user.name;
            res.sendFile(__dirname + '/views/index.html');
            res.cookie('name', sess.name);
          }
        });
      });
    });
  }
});

app.get('/login', function(req, res){
  res.redirect('https://api.twitch.tv/kraken/oauth2/authorize?response_type=code&client_id=' + process.env.APP_ID + '&redirect_uri=http://localhost:3000/oauth&scope=user_read');
});

app.get('/api/events', function(req, res){
  db.Event.find({}, function(err, allEvents){
    res.json(allEvents);
  });
});

app.get('/api/events/:id', function(req, res){
  var id = req.params.id;
  db.Event.findOne({_id: id}, function(err, event){
    if(err){
      return console.log(err);
    }
    res.json(event);
  });
});

app.post('/api/events', function(req, res){
  var game = req.body.game.split(" ").join("+")
  request.get("https://api.twitch.tv/kraken/search/games?client_id="+process.env.APP_ID+"&q="+game+"&type=suggest", function(err, response, data){
    console.log(err);
    console.log(response);
    console.log(data);
    data = JSON.parse(data);
    var games = data.games;
    var image;
    console.log(games);
    if(games){
      for(var i = 0; i < games.length; i++){
        if(games[i].name.toLowerCase() === req.body.game.trim().toLowerCase()){
          image = games[i].box.large;
        }
      }
      if(!image){
        image=games[0].box.large
      }
    }
    image = image || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'
    var newEvent = new db.Event({
      name: req.body.name,
      description: req.body.description,
      game: req.body.game,
      creator: req.body.creator,
      participants: [req.body.creator],
      time: req.body.time,
      imgUrl: image
    });

    newEvent.save(function(err, event){
        if (err) {
          return console.log("save error: " + err);
        }
        console.log("saved ", event.name);
        res.json(event);
      });
  });
});

app.put("/api/events/:id", function(req, res){
  var sess = req.session;
  if(sess.name === req.body.name){
    db.Event.findOneAndUpdate({_id: req.params.id}, {$set:{participants: req.body.participants}},{new: true}, function(err, updated){
      if(err){
        return console.log.err
      }
      res.json(updated);
    });
  }
});

app.get('*', function homepage(req, res) {
  var sess = req.session;
  console.log(sess);
  res.sendFile(__dirname + '/views/index.html');
});


app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is up and running on http://localhost:3000/');
});
