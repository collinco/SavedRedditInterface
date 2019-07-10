# Saved Reddit Interface

Website: https://reddit-saved-app.herokuapp.com

This tool is for Reddit user's to see all of their saved posts or comments all at once. This was meant to solve the problem of manually scrolling through ~25 items at a time and having lots of useless clutter. In addition to viewing your post/comments there is the ability to unsave them directly from the app. Comment any additional features you would like to see.

## Install Locally

If you don't trust the website and/or want to mess with things locally, please feel free to clone the repo! Use the below steps to get up and running

1. Clone 'Master' and navigate to it

```
git clone git@github.com:hippohipporhino/SavedRedditInterface.git
cd SavedRedditInterface
```

2. Create a Reddit app using your profile (https://www.reddit.com/prefs/apps/)

3. Create a config.js file with your Reddit App details 

```
var config = {};

config.userAgent = "A Computer";
config.clientId = "d1Oayi-DXkXFby";
config.clientSecret = "2lunMerjKDS9syW-5OWYagDKJUsY";

module.exports = config;
```

4. run ```node app.js```

## Branches

the 'Heroku' branch is what is currently on the website hosted by Heroku. It is redeployed after new commits are pushed to 'Heroku'.
the 'Master' branch is what should be downloaded if someone wants the code since it is missing the Heroku environment variables.

## Built With

* [Snoowrap](https://github.com/not-an-aardvark/snoowrap) - The JS Reddit API wrapper used

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
