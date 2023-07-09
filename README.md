<!-- PROJECT LOGO -->
<h1>7/9/2023 UPDATE</h1>
<p>Confirmed this project still works. However the free tier of Heroku this was hosted on is <a target="_blank" href="https://help.heroku.com/RSBRUH58/removal-of-heroku-free-product-plans-faq">no longer available</a>. I am no longer working on thie project and thus there are no plans to rehost.</p>

<br />
<p align="center">
  <h3 align="center">Saved Reddit Interface</h3>
  <p align="center">https://reddit-saved-app.herokuapp.com</p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#features">Features</a></li>
    <li><a href="#local-installation">Local Installation</a></li>
    <li><a href="#branches">Branches</a></li>
    <li><a href="#todo">TODO</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project
This tool lets Reddit users access all of their saved posts or comments on one page. This was meant to solve the problem of manually scrolling through ~25 items at a time with the Reddit website. In addition to viewing your post/comments, there is the ability to un-save them directly from the app. Users are authenticated with OAuth2 for 1 hour with relevant score.  I have this code hosted on a small and slow heroku instance here : https://reddit-saved-app.herokuapp.com. Please feel free to open a PRs for any improvement!

<p align="center">
  <img src="https://user-images.githubusercontent.com/13059208/115659013-849a5880-a2ff-11eb-8788-f347a8c63aa9.png">
</p>

### Built With

* [Snoowrap](https://github.com/not-an-aardvark/snoowrap) - JS Reddit API wrapper
* [Handlebars](https://handlebarsjs.com/) - Templating engine
* [Node.js](https://nodejs.org/en/)/[Express](http://expressjs.com/) - Backend

<!-- Features -->
## Features
After authenticating users will be able to:
- see all your saved items on one page
- see how exactly how many posts or items you have
- follow a link to the item
- un-save an item 

<!-- Local Installation -->
## Local Installation
If you don't trust the website and/or want to mess with things locally, please feel free to clone the repo! Use the below steps to get up and running

1. Clone the 'Master' branch and navigate to it.

```
git clone git@github.com:collinco/SavedRedditInterface.git
cd SavedRedditInterface
```
2. Run `npm install` to get necessary packages.

3. Create a Reddit app using your profile here : https://www.reddit.com/prefs/apps/. Make sure you set the redirect URI to your server
![image](https://user-images.githubusercontent.com/13059208/115661814-a7c70700-a303-11eb-8806-ab8848397033.png)

4. Create a config.js file with your Reddit App details. put it in the root directory where app.js is.

```
var config = {};

config.userAgent = "A Computer";
config.clientId = "d1OayiDXkXFby";
config.clientSecret = "2lunMerjKDS9syW-5OWYagDKJUsY";

module.exports = config;
```

4. run `node app.js` to start the server.

<!-- Branches -->
## Branches

- the 'Master' branch is what should be downloaded if someone wants the code since it is missing the Heroku environment variables.
- the 'Heroku' branch is what is currently on the website hosted by Heroku. It is redeployed after new commits are pushed to 'Heroku'.

<!-- //TODO -->
## TODO

Possible improvements:
- ability to minimize comments and posts sections
- better/lazy loading
- revamp design, very basic currently
- display user's account name

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
