const { response } = require('express');
const mongoose = require('mongoose');
const { boolean } = require('zod');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL);

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const chatSchema = new mongoose.Schema({
    user: String,
    query: String,
    response: String
});

const User = mongoose.model('User', userSchema);
const Chat = mongoose.model('Chat', chatSchema);

module.exports = { 
    User: User,
    Chat: Chat
 };