const mongoose = require('mongoose');
require('../connection.js')

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

const users = mongoose.model('users', UserSchema);

module.exports = users;