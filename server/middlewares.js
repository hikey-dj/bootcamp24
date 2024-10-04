const express = require('express');
const secret = process.env.SECRET;
const jwt = require('jsonwebtoken');
// middlewares.js


// Example middleware to log request details
const userMiddleware = (req, res, next) => {
    let token = req.headers.authorization;
    let decoded = jwt.verify(token, secret);
    if(decoded)
    {
        req.body.email = decoded.email;
        next();
    }
    else
    {
        res.status(401).json('Unauthorized');
    }
};


module.exports = {
    userMiddleware: userMiddleware
};