/**
 * Splash
 * shows a splash screen while items are loading 
 */

Splash = function() {

  var splash = document.createElement('div');

  splash.setAttribute('id', "splash");
  splash.setAttribute('class', "loading-invisible");
  splash.style.color = "#fff";
  splash.innerHtml = 'Loading';
  document.body.appendChild(splash);

  // Add Title image
  var title = document.createElement("IMG");
  title.src = "rsc/images/logo_small.png";
  document.getElementById('splash').appendChild(title);

  document.getElementById('splash').appendChild(document.createElement('div'));

  // Add loading gif image
  var title = document.createElement("IMG");
  //title.src = "rsc/images/loading.png";
  title.src = "http://www.mytreedb.com/uploads/mytreedb/loader/ajax_loader_red_32.gif";

  document.getElementById('splash').appendChild(title);

  splash.className = "loading-visible";
  var hideDiv = function() {
    splash.className = "loading-invisible";
  };
  var oldLoad = window.onload;
  var newLoad = oldLoad ? function() {
    hideDiv.call(this);
    oldLoad.call(this);
  } : hideDiv;
  window.onload = newLoad;
}
