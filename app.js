'use strict';

// modules
const snoowrap = require('snoowrap');
const http = require('http');
const express = require('express');
const hbs = require('hbs');
const config = require('./config');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// messing around with partials
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentYear', function () {
    return new Date().getFullYear();
})

var app = express();

// Using MemoryStore for sessions since this is a small app
app.use(cookieParser());
app.use(session({
    secret: "Shh, its a secret!",
    resave: false,
    saveUninitialized: false
}));

app.use("/assets", express.static(__dirname + "/assets"));
app.use("/views", express.static(__dirname + "/views"));

const port = 8080;
const url = "http://localhost:8080";

// views folder is default directory express uses
app.set('view engine', 'hbs');

// redirect to /saved when authorization is successful
app.get('/authorize_callback', (req, res) => {
    req.session.AuthCodeProperties = {};
    req.session.AuthCodeProperties = req.query;
    res.redirect('/saved')
})

// call API for saved posts
app.get('/saved', (req, res) => {
    if( !req.session.authObject) {
        snoowrap.fromAuthCode({
            code: req.session.AuthCodeProperties.code,
            userAgent: config.userAgent,
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            redirectUri: url + "/authorize_callback"
        }).then(r => {
            req.session.authObject = r;

            // don't reload data if we have it
            if (!req.session.loadedSavedData) {
                // results returned can be changed here
                r.getMe().getSavedContent({limit: Infinity}).then(jsonResponse => {
                    req.session.data = jsonResponse;
                    req.session.sortedObj = {};
                    req.session.sortedComments = {};
                    req.session.subreddits = [];
                    seperateCategories(jsonResponse, req);
                    req.session.loadedSavedData = true;
                    renderMainPage(res, req);                
                })
            } else {
                renderMainPage(res, req);
            }   
        })
    } else {

        const authObject = new snoowrap(
            req.session.authObject
        );

        authObject.getMe().getSavedContent({limit: Infinity}).then(jsonResponse => {
            req.session.data = jsonResponse;
            req.session.sortedObj = {};
            req.session.sortedComments = {};
            req.session.subreddits = [];
            seperateCategories(jsonResponse, req);
            req.session.loadedSavedData = true;
            renderMainPage(res, req);    
        })
    }
})

// create authentication URL and render home page 
app.get('/', function(req,res) {
    var authenticationUrl = snoowrap.getAuthUrl({
        clientId: config.clientId,
        scope: [ 'save', 'history', 'identity', 'read'],
        redirectUri: url + '/authorize_callback',
        permanent: false,
        state: 'fe311bebc52eb3da9bef8db6e63104d3' // a random string, this could be validated when the user is redirected back
      });
      // --> 'https://www.reddit.com/api/v1/authorize?client_id=foobarbaz&response_type=code&state= ...'
      
    res.render('start.hbs', {
        authenticationUrl: authenticationUrl,
    });
});

// get raw json
app.get('/unformatted', (req, res) => {
    var x = r.getMe().getSavedContent({limit: 3}).then(jsonResponse => { 
        res.send(jsonResponse);
    })
})

// unsave post
app.get('/unsaveSubmission/:id', (req, res) => {

    const authObject = new snoowrap(
        req.session.authObject
    );
      
    for (var i = 0, len = req.session.data.length; i < len; i++) {
        if (req.session.data[i].id === req.params.id) {                   
            authObject.getSubmission(req.params.id).unsave().then(test => {
                res.send('success');
            })
        }
    }
})

// unsave comment
app.get('/unsaveComment/:id', (req, res) => {

    const authObject = new snoowrap(
        req.session.authObject
    );

    for (var i = 0, len = req.session.data.length; i < len; i++) {
        if (req.session.data[i].id === req.params.id) {

            authObject.getComment(req.params.id).unsave().then(test => {
                res.send('success');
            })
        }
    }
    // res.send('fail')    
})

app.listen(port, () => {
    console.log('Our app is running on http://localhost:' + port);
})

var renderMainPage = function(res,req){
    res.render('saved.hbs', {
        pageTitle: 'Saved',
        formattedData : req.session.sortedObj,
        formmatedComments : req.session.sortedComments, 
        hasPosts : !isEmpty(req.session.sortedObj),
        hasComments : !isEmpty(req.session.sortedComments),
        subreddits : req.session.subreddits
    });
}

var isEmpty = function (obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

var seperateCategories = function (unsortedObj, req) {
    for (var i = 0; i < unsortedObj.length; i++) {
        // if object is a post
        // using body_html to differentiate posts form comments
        if (unsortedObj[i].body_html === undefined) {
            if (req.session.sortedObj[unsortedObj[i].subreddit_name_prefixed]){
                req.session.sortedObj[unsortedObj[i].subreddit_name_prefixed].push(unsortedObj[i]);
            } else {
                req.session.sortedObj[unsortedObj[i].subreddit_name_prefixed] = [ unsortedObj[i] ];
    
                //add to subreddits array since this is first TODO DRY
                req.session.subreddits.push(unsortedObj[i].subreddit_name_prefixed);
            }
        }
        // if object is a comment    
        else {
            if (req.session.sortedComments[unsortedObj[i].subreddit_name_prefixed]){
                req.session.sortedComments[unsortedObj[i].subreddit_name_prefixed].push(unsortedObj[i]);
            } else {
                req.session.sortedComments[unsortedObj[i].subreddit_name_prefixed] = [ unsortedObj[i] ];
            }
        }
    }
} 