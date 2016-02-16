var User = require('../models/User');
var jwt = require('jsonwebtoken');
var mySpecialSecret = "pizza";

function index(req, res){
  // get all the users -- index
  User.find(function(err, users){
    if(err) res.send(err)
    res.json(users)
  })
}

function create(req, res){
  // make a single user -- create
  console.log("Creating a user")
  var user = new User()

  user.name = req.body.name;
  user.username = req.body.username;
  user.password = req.body.password;
  user.first_name = req.body.first_name;
  user.last_name = req.body.last_name;
  user.mental_health_physician = req.body.mental_health_physician;
  user.physician_email = req.body.physician_email;
  user.joy = req.body.joy;   
  user.acceptance = req.body.acceptance;
  user.fear = req.body.fear;
  user.surprise = req.body.surprise;
  user.sadness = req.body.sadness; 
  user.disgust = req.body.disgust;   
  user.anger = req.body.anger; 
  user.anticipation = req.body.anticipation;

  user.save(function(err){
    if(err){
      if(err.code == 11000){
        return res.json({success: false, message: "username already exists" })
      } else {
        res.send(err)
      }
    }
    res.json({success: true, message: "User created, Wahey!"})
  })
}

function show(req, res){
  //get a single user -- show
  User.findById(req.params.user_id, function(err, user){
    if(err) res.send(err)
    res.json(user)
  })
}

function update(req, res){
  // update a single user -- update
  User.findById(req.params.user_id, function(err, user){
    if(err) res.send(err)

    if(req.body.name) user.name = req.body.name;
    if(req.body.username) user.username = req.body.username;
    if(req.body.password) user.password = req.body.password;
    if(req.body.first_name) user.first_name = req.body.first_name;
    if(req.body.last_name) user.last_name = req.body.last_name;
    if(req.body.mental_health_physician) user.mental_health_physician = req.body.mental_health_physician;
    if(req.body.physician_email) user.physician_email = req.body.physician_email;
    if(req.body.joy) user.joy = req.body.joy;   
    if(req.body.acceptance) user.acceptance = req.body.acceptance;
    if(req.body.fear) user.fear = req.body.fear;
    if(req.body.surprise) user.surprise = req.body.surprise;
    if(req.body.sadness) user.sadness = req.body.sadness; 
    if(req.body.disgust) user.disgust = req.body.disgust;   
    if(req.body.anger) user.anger = req.body.anger; 
    if(req.body.anticipation) user.anticipation = req.body.anticipation;

    user.save(function(err){
      if(err) res.send(err)
      res.json({success: true, message: "you have been updated!"})
    })
  })
}

function destroy(req, res){
  // delete a single user -- destroy
  User.remove({
    _id: req.params.user_id
  }, function(err, user){
    if(err) res.send(err)
    res.json({success: true, message: "YOU HAVE BEEN TERMINATED!"})
  })
}


//code for apiRouter.route('/authenticate')
function authenticateUser(req, res) {
  console.log('trying to generate a JWT')
  // 1 - find the user in our db
  User.findOne({
    username: req.body.username
  }).select('name username password').exec(function(err, user){
    if(err) throw err
    if(!user){
      res.json({success: false, message: "No such user"})
    } else if(user){
      // check passwords
      var validPassword = user.comparePassword(req.body.password)
      if(!validPassword){
        res.json({success: false, message: "Invalid password"})
      } else {
        // password is good!
        var token = jwt.sign({
          name: user.name,
          username: user.username
        }, mySpecialSecret, {
          expiresInMinutes: 1440
        })
        // now let's actually give it to them!
        console.log("logged in")
        res.json({ success: true, message: "enjoy your token!", token: token})
      }
    }
  })
}

function checkUser(req, res, next){
  // let's check everywhere for the JWT!
  var token = req.body.token || req.param('token') || req.headers['x-access-token']
  // if we find the token, let's use mySpecialSecret to try and decode it.
  if(token){
    jwt.verify(token, mySpecialSecret, function(err, decoded){
      if(err){
        res.status(403).send({success: false, message: "forbidden, token can't be decoded"})
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    res.status(403).send({success: false, message: "no token. You're not even trying"})
  }
  // this is going to run EVERY time our API is hit
  // we want to check if the user is logged in here
  console.log("checking if user is logged in")
}

module.exports = {
  index: index,
  create: create,
  show: show,
  update: update,
  destroy: destroy,
  authenticate: authenticateUser,
  checkUser: checkUser
}




