const mongoose = require('mongoose');
require('../connection.js')

const UserSchema = new mongoose.Schema({
	email: {type: String, required: true, unique: true},
	username: {type: String, required: true, unique: true},
	console: {type: String, required: false},
	game: {type: String, required: false},
	tell: {type: String, required: false},
	info: {type: String, required: false},
	password: {type: String, required: true},
	challengers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users'
	}]
});

const users = mongoose.model('users', UserSchema);

module.exports = users;