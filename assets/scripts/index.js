var unsave = function (itemId) {
  if (confirm('Are you sure you want to unsave this item')) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/unsave/' + itemId);
    //something would go here if it was a POST
    xhr.send(null);

    xhr.onreadystatechange = function () {
        var DONE = 4; // readyState 4 means the request is done.
        var OK = 200; // status 200 is a successful return.
        if (xhr.readyState === DONE) {
          if (xhr.status == OK) 
            console.log(xhr.responseText); // 'This is the returned text.'
          } else {
            console.log('Error: ' + xhr.status); // An error occurred during the request.
          }
        }
    }
  };
