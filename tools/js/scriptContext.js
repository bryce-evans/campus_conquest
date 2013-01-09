//var renderer;
//var scriptContext;
$(document).ready(function() {

	var firstRunTime = undefined;
	var lastFrameTime = undefined;

	var fpsNFrames = 0;
	var fpsReferenceTime = 0;
	var fps = 0;
	var fpsTimeInterval = 1.0;

	window.scriptContext = {
		Run : function() {
			var currentTime = (new Date()).getTime() / 1000.0;
			if (firstRunTime == undefined) {
				firstRunTime = currentTime;
				lastFrameTime = currentTime;
				fpsStartTime = currentTime;
			}

			var scriptRunningTime = currentTime - firstRunTime;
			var scriptDTime = currentTime - lastFrameTime;

			if ( typeof window.frame == 'function') {
				frame(scriptRunningTime, scriptDTime);
			} else if ( typeof window.Frame == 'function') {
				Frame(scriptRunningTime, scriptDTime);
			}
			requestAnimationFrame(scriptContext.Run);

			lastFrameTime = currentTime;

			fpsNFrames++;
			if ((currentTime - fpsReferenceTime) >= fpsTimeInterval) {
				fps = fpsNFrames / (currentTime - fpsReferenceTime);
				fpsReferenceTime = currentTime;
				fpsNFrames = 0;
			}

		},

		GetFPS : function() {
			return fps;
		}
	};
});
// ready