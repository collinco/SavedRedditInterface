'use strict';
const snoowrap = require('snoowrap');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const http = require('http');
var express = require('express');
const hbs = require('hbs');


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
app.use("/views", express.static(__dirname + "/views"));

// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

var data = null;
var sortedObj = {};
var sortedComments = {};
var subreddits = [];
var counts = {};
var loadedSavedData = false;
var AuthCodeProperties = {};

var url = "https://reddit-saved-app.herokuapp.com"

// views folder is default directory express uses
app.set('view engine', 'hbs');

app.get('/authorize_callback', (req, res) => {
    AuthCodeProperties = req.query;
    res.redirect('/saved')
})

app.get('/saved', (req, res) => {
    
    snoowrap.fromAuthCode({
        code: AuthCodeProperties.code,
        userAgent: process.env.UserAgent,
        clientId: process.env.ClientId,
        clientSecret: process.env.ClientSecret,
        redirectUri: url + "/authorize_callback"
    }).then(r => {
        if (!loadedSavedData) {
            // var x = r.getMe().getSavedContent({limit: Infinity}).then(jsonResponse => {
            var x = r.getMe().getSavedContent({limit: Infinity}).then(jsonResponse => {
                data = jsonResponse;
                seperateCategories(jsonResponse);
                loadedSavedData = true;
                renderMainPage(res);
            })
        } else {
            renderMainPage(res);
        }
    })
})

app.get('/')

app.get('/', function(req,res) {
    var authenticationUrl = snoowrap.getAuthUrl({
        clientId: process.env.ClientId,
        scope: [ 'save', 'history', 'identity'],
        redirectUri: url + '/authorize_callback',
        permanent: false,
        state: 'fe311bebc52eb3da9bef8db6e63104d3' // a random string, this could be validated when the user is redirected back
      });
      // --> 'https://www.reddit.com/api/v1/authorize?client_id=foobarbaz&response_type=code&state= ...'
      
    res.render('start.hbs', {
        authenticationUrl: authenticationUrl,
    });
    //   res.redirect(authenticationUrl)
    // res.render('start.hbs');
});

// respond with "hello world" when a GET request is made to the homepage
// check caching possibilties?
app.get('/index', function (req, res) {
    // res.send('hello Cole')
    res.render('about.hbs', {
        pageTitle: 'About',
        test : crap
    });
  })


// app.get('/unformatted', (req, res) => {
//     var x = r.getMe().getSavedContent({limit: 3}).then(jsonResponse => { 
//         res.send(jsonResponse);
//     })
// })

app.get('/unsaveSubmission/:id', (req, res) => {
    console.log('deleting submission')    
    for (var i = 0, len = data.length; i < len; i++) {
        if (data[i].id === req.params.id) {         
            r.getSubmission(req.params.id).unsave().then(test => {
                res.send('success');
            })
        }
    }
    // res.send('fail')   
})

app.get('/unsaveComment/:id', (req, res) => {
    console.log('deleting comment')
    for (var i = 0, len = data.length; i < len; i++) {
        if (data[i].id === req.params.id) {
            r.getComment(req.params.id).unsave().then(test => {
                res.send('success');
            })
        }
    }
    // res.send('fail')    
})

app.listen(port, () => {
    console.log('Our app is running on http://localhost:' + port);
})

var renderMainPage = function(res){
    res.render('about.hbs', {
        pageTitle: 'About',
        formattedData : sortedObj,
        formmatedComments : sortedComments, 
        hasPosts : !isEmpty(sortedObj),
        hasComments : !isEmpty(sortedComments),
        subreddits : subreddits,
        counts : counts
    });
}

var isEmpty = function (obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

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