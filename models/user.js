var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs')

var User = mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true, select: false },
    password_confirmation: { type: String, required: true },
	first_name: String,
	last_name: String, 
	user_email: String,
	mental_health_physician: String, 
	physician_email: String,
    
    contempt_color: String, 
    happiness_color: String, 
	sadness_color: String, 
    angry_color: String,
    fear_color: String, 
    anxious_color: String, 
    acceptance_color: String,
    love_color: String, 
    disgust_color: String     
});

// hash the password of a user before he/she is saved
User.pre('save', function(next){
	var user = this;
	//hash the password only if the user is new, or the password has changed
	if(!user.isModified('password')) return next()
	bcrypt.hash(user.password, null, null, function(err, hash){
		//if error, just move on, with the error
		if(err) return next(err)
		// if no error, set the user.password to the hash, then move on to saving.
		user.password = hash
		next()
	})
})

// give the UserSchema a method to compare incoming passwords 
// with stored/hashed version
User.methods.comparePassword = function(password){
	var user = this;
	return bcrypt.compareSync(password, user.password)
}

module.exports = mongoose.model('User', User);
