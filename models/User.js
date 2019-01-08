const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')

var ObjectId = mongoose.Schema.Types.ObjectId;

const EventInvitationSchema = new mongoose.Schema({
    event: ObjectId,
    people: Number,
    rsvp: Boolean,
    food: Number
});

const UserSchema = new mongoose.Schema({
    email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true, // trim whitespace
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: 'Not valid email'
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
    name: String,
    // email: String,
    // password: String,
    myEvents: [ObjectId],
    upcomingEvents: [EventInvitationSchema]
});

// Our own student finding function 
UserSchema.statics.findByEmailPassword = function(email, password) {
	const User = this

	return User.findOne({email: email}).then((user) => {
		if (!user) {
			return Promise.reject()
		}

		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (error, result) => {
				if (result) {
					resolve(user);
				} else {
					reject();
				}
			})
		})
	})
}

// This function runs before saving user to database
UserSchema.pre('save', function(next) {
	const user = this

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (error, salt) => {
			bcrypt.hash(user.password, salt, (error, hash) => {
				user.password = hash
				next()
			})
		})
	} else {
		next();
	}

})


const User = mongoose.model('User', UserSchema)

module.exports = { User }