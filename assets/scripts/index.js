var unsave = function (itemId, type) {

  if (confirm('Are you sure you want to unsave this item')) {
    
    event.preventDefault() // prevent page shifting to top
    var xhr = new XMLHttpRequest();

    if (type === 'submission'){
      xhr.open('GET', '/unsaveSubmission/' + itemId);
    } else if (type === 'comment') {
      xhr.open('GET', '/unsaveComment/' + itemId);
    }
    //something would go here if it was a POST
    xhr.send(null);

    xhr.onreadystatechange = function () {
        var DONE = 4; // readyState 4 means the request is done.
        var OK = 200; // status 200 is a successful return.
        if (xhr.readyState === DONE) {
          if (xhr.status == OK) {
            removeDiv(itemId);
          } else {
            console.log('Error: ' + xhr.status); // An error occurred during the request.
          }
        } else {
      event.preventDefault(); // prevent page shifting to top
    };
  }
}}

  var removeDiv = function (itemId) {
    var element = document.getElementById(itemId);
    fadeOut(element);
  }

  // fade out in recursive js 
  // found on http://www.chrisbuttery.com/articles/fade-in-fade-out-with-javascript/
  // alternatives were JQuery or additional css
  function fadeOut(el){
    el.style.opacity = 1;

    (function fade() {
      if ((el.style.opacity -= .02) < 0) {
        el.style.display = "none";
      } else {
        requestAnimationFrame(fade);
      }
    })();
  }