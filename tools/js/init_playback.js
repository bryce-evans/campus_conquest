var v=document.createElement("video");
v.style.width="600px";
v.style.height="400px";
v.setAttribute("id", "v");
v.setAttribute("autoplay", "true");
v.setAttribute("loop", "true");
v.setAttribute("src", "http://craftymind.com/factory/html5video/BigBuckBunny_640x360.mp4");
v.setAttribute("type", "video/mp4");
$('#' + containerId).append(v);

var canv=document.createElement("canvas");
canv.setAttribute("id", "c");
$('#' + containerId).append(canv);


var onFailSoHard = function(e) {
		console.log('Reeeejected!', e);
	};

	window.URL = window.URL || window.webkitURL;
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

	var video = document.getElementById('v');
	//var video = document.querySelector('video');

	if (navigator.getUserMedia) {
		navigator.getUserMedia({
			video : true
		}, function(stream) {
			video.src = window.URL.createObjectURL(stream);
		}, onFailSoHard);
	} else {
		alert("error, can't load");
		video.src = 'http://craftymind.com/factory/html5video/BigBuckBunny_640x360.mp4';
		// fallback.
	}
	
    var v = document.getElementById('v');
    var canvas = document.getElementById('c');
    var context = canvas.getContext('2d');
    var back = document.createElement('canvas');
    var backcontext = back.getContext('2d');

    var cw,ch;

    v.addEventListener('play', function(){
        cw = v.clientWidth;
        ch = v.clientHeight;
        canvas.width = 600;
        canvas.height = 400;
        back.width = 600;
        back.height = 400;
        draw(v,context,backcontext,cw,ch);
    },false);

function draw(v,c,bc,w,h) {
    if(v.paused || v.ended) return false;
    // First, draw it into the backing canvas
    bc.drawImage(v,0,0,w,h);
    // Grab the pixel data from the backing canvas
    var idata = bc.getImageData(0,0,w,h);
    var data = idata.data;
    // Loop through the pixels, turning them grayscale
    for(var i = 0; i < data.length; i+=4) {
        var r = data[i];
        var g = data[i+1];
        var b = data[i+2];
        var brightness = (3*r+4*g+b)>>>3;
        // data[i] = brightness;
        // data[i+1] = brightness;
        // data[i+2] = brightness;
        data[i] = 2*g;
        data[i+1] = b;
        data[i+2] = 4*r;
    }
    idata.data = data;
    // Draw the pixels onto the visible canvas
    c.putImageData(idata,0,0);
    // next frame
    setTimeout(function(){ draw(v,c,bc,w,h); }, 0);
}