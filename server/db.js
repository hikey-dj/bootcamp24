const mongoose = require('mongoose');
const { boolean } = require('zod');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL);

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

module.exports = { 
    User: User,
 };