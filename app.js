'use strict';
const snoowrap = require('snoowrap');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const http = require('http');
var express = require('express');
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

app.use("/assets", express.static(__dirname + "/assets"));

const hostname = '127.0.0.1';
const port = 3000;

const r = new snoowrap({
    userAgent:  config.userAgent,
    clientId:  config.clientId,
    clientSecret:  config.clientSecret,
    username: config.username,
    password: config.password
});

var data = null;
var sortedObj = {};
var sortedComments = {};
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
        data = jsonResponse
        seperateCategories(jsonResponse);
        res.render('about.hbs', {
            pageTitle: 'About',
            formattedData : sortedObj,
            formmatedComments : sortedComments, 
            subreddits : subreddits,
            counts : counts
        });
    })
})

app.get('/unformatted', (req, res) => {
    var x = r.getMe().getSavedContent({limit: 3}).then(jsonResponse => { 
        res.send(jsonResponse);
    })
})

app.get('/unsave/:id', (req, res) => {
    for (var i = 0, len = data.length; i < len; i++) {
        if (data[i].id === req.params.id) {
            r.getSubmission(req.params.id).unsave().then(test => {
                res.send('success');
            })
        }
    }
    // res.send('fail')   
    
})

app.listen(5656, () => {
    console.log('http://localhost:5656')
})

var seperateCategories = function (unsortedObj) {
    for (var i = 0; i < unsortedObj.length; i++) {
        // if object is a post
        // using body_html to differentiate posts form comments
        if (unsortedObj[i].body_html === undefined) {
            if (sortedObj[unsortedObj[i].subreddit_name_prefixed]){
                sortedObj[unsortedObj[i].subreddit_name_prefixed].push(unsortedObj[i]);
            } else {
                sortedObj[unsortedObj[i].subreddit_name_prefixed] = [ unsortedObj[i] ];
    
                //add to subreddits array since this is first TODO DRY
                subreddits.push(unsortedObj[i].subreddit_name_prefixed);
            }
        }
        // if object is a comment    
        else {
            if (sortedComments[unsortedObj[i].subreddit_name_prefixed]){
                sortedComments[unsortedObj[i].subreddit_name_prefixed].push(unsortedObj[i]);
            } else {
                sortedComments[unsortedObj[i].subreddit_name_prefixed] = [ unsortedObj[i] ];
            }
        }
    }
} 