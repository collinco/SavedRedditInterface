'use strict';
const snoowrap = require('snoowrap');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const http = require('http');
var express = require('express')
const hbs = require('hbs');
var config = require('./config');



hbs.registerPartials(__dirname + '/views/partials');
//these can take params
hbs.registerHelper('getCurrentYear', function () {
    return new Date().getFullYear()
})

hbs.registerHelper('getCurrentYear', function () {
    return new Date().getFullYear()
})

var app = express();

const hostname = '127.0.0.1';
const port = 3000;

var crap = [{ test : 'hmmm', test2 : '2'}, { test : 'hhmm', test2 : 'Cole'}]

const r = new snoowrap({
    userAgent:  config.userAgent,
    clientId:  config.clientId,
    clientSecret:  config.clientSecret,
    username: config.username,
    password: config.password
});

var sortedObj = {};
var subreddits = [];
var counts = {};

// views folder is default directory express uses
app.set('view engine', 'hbs');

// respond with "hello world" when a GET request is made to the homepage
// check caching possibilties?
app.get('/index', function (req, res) {
    // res.send('hello Cole')
    res.render('about.hbs', {
        pageTitle: 'About',
        test : crap
    });
  })

app.get('/', (req, res) => {
      
    // var x = r.getMe().getSavedContent({limit: Infinity}).then(jsonResponse => {
    var x = r.getMe().getSavedContent({limit: 3}).then(jsonResponse => {
        var formattedData = seperateCategories(jsonResponse);

        res.render('about.hbs', {
            pageTitle: 'About',
            formattedData : formattedData,
            subreddits : subreddits,
            counts : counts
        });
    })
})

app.listen(5656, () => {
    console.log('http://localhost:5656')
})

var seperateCategories = function (unsortedObj) {
    for (var i = 0; i < unsortedObj.length; i++) {
        if (sortedObj[unsortedObj[i].subreddit_name_prefixed]){
            sortedObj[unsortedObj[i].subreddit_name_prefixed].push(unsortedObj[i]);
        } else {
            sortedObj[unsortedObj[i].subreddit_name_prefixed] = [ unsortedObj[i] ];

            //add to subreddits array since this is first TODO DRY
            subreddits.push(unsortedObj[i].subreddit_name_prefixed);
        }
    }
    
    console.log('subreddits', subreddits)
    console.log('sortedObj', Object.getOwnPropertyNames(sortedObj));
    for ( var variable in sortedObj) {
        console.log("the variable " + variable + " has " + sortedObj[variable].length)
    }


    return sortedObj;
} 