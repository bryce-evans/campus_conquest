/*
 * Global variables:
 *  REMOVED window.saved_id - if a project has been saved this variable holds the id.
 *  window.rawScript - if this variable holds something the editor should show it.
 *                     The variable is used when forking to pass the script code
 *                     between the windows.
 *  REMOVED doesNotNeedSaving - if set, it means that the project has just been saved, so
 *                      show 'Save' instead of 'Save*'.
 *
 */
var bg = "000006";
// var bloom = true;
// var film = true;
$(document).ready(
function() {
	
	 var cur_view = "sphere";
    
          $('#plane').click(function(event) {
        	cur_view = "plane";
            runCode();
        });
        $('#sphere').click(function(event) {
        	cur_view = "sphere";
            runCode();
        });
        $('#torus').click(function(event) {
        	cur_view = "torus";
            runCode();
        });
        
        $("#bg").change(function(){
        	var bg_field =  $("#bg");
        	bg = bg_field.val();
        	bg_field.css("background-color", "#" + bg);
        	runCode();
	 	   //bg.css.backgroundColor("#" + val);
	 	  // bg.css.color("#" + "ffffff");
 });

        $('#bloom').change(function(){
		    bloom = this.checked;
		    runCode();
		});
// 
        $('#film').change(function(){
		    film = this.checked;
		    runCode();
		});
// 	        
	        
	        
    //history.navigationMode = 'compatible'; // not necessary i think
    
    var editor;
    var prevHighlightedLines = [];
    //var baseURL = 'http://hci.deri.ie/webglplayground';
    var baseURL = 'http://webglplayground.net'; // createHTML does not use this link so make sure you sync it
    var saved_id = getIdIfExists();
    var fpsElement = $('#fps'); // performance
    //var doesNotNeedSaving = true; //change name do uptodate
    //var canBeContributed = true; // set to false after the project has been contributed

    window.WebGLPlaygroundAPI = {
        createHTML: createHTML,
        doesNotNeedSaving: true
    };

    plug();
    runCode();

    window.WebGLPlaygroundAPI.editor = editor;

    function plug() {
        //// set up save button
        //if (saved_id) {
        //    // if saved_id exists, it means that it has been just saved
        //} else {
        //    // a project created from template, fork, gallery entry so it should
        //    // be saved
        //    doesNotNeedSaving = false;
        //    $('#save_button').text('Save*');
        //}

        // plug editor
        editor = CodeMirror.fromTextArea(document.getElementById("editor"), { //$('#editor').get(0), {
            //value: "var k=1;\nfunction frame() {} \n\n@vs1\nvoid main() {}\n\n@fs1\nvoid main() {}\n",
            mode: "editor",
            //lineNumbers: true,
            onChange: function() { // on each keystroke
                // highlight @ lines
                highlightShaderTitles();
                
                //window.doesNotNeedSaving = false;
                //alert("ala");
                window.WebGLPlaygroundAPI.doesNotNeedSaving = false;
                $('#save_button').text('Save*');
            }
        });
        highlightShaderTitles();
        
        if (typeof(rawScript) !== 'undefined') {
            editor.setValue(rawScript);
        }

       
        $('#run').click(function(event) {
            runCode();
        });

    }

    // creates code of the script
    function createScriptAndLibsAndInfo() {
        text = editor.getValue();
        
        var jsCode = undefined;
        //var vsCode = {};
        //var fsCode = {};
        var glslCode = {};
        var libs = [
        '../js/lib/jQuery.js',
'../js/lib/Three.js',
'../js/lib/shaders/ConvolutionShader.js',
'../js/lib/shaders/CopyShader.js',
'../js/lib/shaders/FilmShader.js',
'../js/lib/postprocessing/EffectComposer.js',
'../js/lib/postprocessing/ShaderPass.js',
'../js/lib/postprocessing/MaskPass.js',
'../js/lib/postprocessing/RenderPass.js',
'../js/lib/postprocessing/BloomPass.js',
'../js/lib/postprocessing/FilmPass.js',
'../js/lib/Detector.js',
'../js/lib/Stats.js'];
        var info = ''
        
        var textChunks = text.split("@");
        //jsCode = textChunks[0];
        
        var anySectionFound = false;
        
        // populate jsCode, vsCode, fsCode, libs
        for (var i=0; i<textChunks.length; i++) {
            


            chunkNames = textChunks[i].match(/^glsl[_\d\w]*/i);
            if (chunkNames!=null && chunkNames.length>0) {
                textChunks[i] = textChunks[i].replace(chunkNames[0], '');
                glslCode[chunkNames[0]] = textChunks[i];
                //alert(chunkNames[0] + " = " + textChunks[i]);
                anySectionFound = true;
                continue;
            }
            
            // is it libs?
            chunkNames = textChunks[i].match(/^libs/i);
            if (chunkNames!=null && chunkNames.length>0) {
                textChunks[i] = textChunks[i].replace(chunkNames[0], '');
                var libsUntrimmed = textChunks[i].split("\n");
                for (var j=0; j<libsUntrimmed.length; j++) {
                    var lib = libsUntrimmed[j];
                    lib.replace(/\s/ig, '');
                    if (lib.length>0) {
                        libs.push(lib);
                    }
                }
                anySectionFound = true;
                continue;
            }
            
            // is it info?
            chunkNames = textChunks[i].match(/^info/i);
            if (chunkNames!=null && chunkNames.length>0) {
                textChunks[i] = textChunks[i].replace(chunkNames[0], '');
                info = textChunks[i].replace("\n", "<br/>");
                anySectionFound = true;
            }
            
            // is it a main section?
            var chunkNames = textChunks[i].match(/^main/i);
            if (chunkNames!=null && chunkNames.length>0) {
                textChunks[i] = textChunks[i].replace(chunkNames[0], '');
                jsCode = textChunks[i];
                //alert(chunkNames[0] + " = " + textChunks[i]);
                anySectionFound = true;
                continue;
            }
            
            if (anySectionFound == false) {
            	
                anySectionFound = true;
                jsCode =  textChunks[i]; //XXX
            }
        }
        
        if (jsCode==undefined) {
            if (text.match(/^\s*@/i)) {
                // TODO: problem, there is no main section but and the whole
                // script starts with another section
                jsCode = '';
            } else {
                jsCode = textChunks[0];
            }
        }
        
        // inject vsCode/fsCode into jsCode
        //var vsCodeInJS = createJSArrayString(vsCode);
        //var fsCodeInJS = createJSArrayString(fsCode);
        var glslCodeInJS = createJSArrayString(glslCode);
        //jsCode = vsCodeInJS + fsCodeInJS + jsCode;
//         
        var bloom_code = bloom ? 'composer.addPass(effectBloom);' : '';
        var film_code = film ? 'composer.addPass(effectFilm);' : '';
//         
        // alert(bloom_code + film_code);
        
         var init_code = [
         'const bg = 0x'+bg,
'var container, stats;',
'var renderer = new THREE.WebGLRenderer({',
'	antialias : true,',
'	clearColor : bg,',
'	clearAlpha : 1',
'});',
'renderer.setSize(viewportWidth, viewportHeight);',
'$("#" + containerId).append(renderer.domElement);',
'var clock = new THREE.Clock();',
'var camera, scene, renderer, composer;',
'var uniforms, material, mesh;',
'var mouseX = 0, mouseY = 0, lat = 0, lon = 0, phy = 0, theta = 0;',
'var width = window.innerWidth || 2;',
'var height = window.innerHeight || 2;',
'var windowHalfX = width / 2;',
'var windowHalfY = height / 2;',
'init();',
'animate();',
'function init() {',
	'scene = new THREE.Scene();',
	'if (view == "torus" || view == "sphere") {',
		'camera = new THREE.PerspectiveCamera(35, windowHalfX / windowHalfY, 1, 3000);',
		'camera.position.z = 4;',
	'} else {',
		'camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100.0);',
		'camera.position.z = 1.0;',
	'}',
	'scene.add(camera);',
	'var size = 0.65;',
	'uniforms = {',
		'fogDensity : {',
			'type : "f",',
			'value : 0.45',
		'},',
		'fogColor : {',
			'type : "v3",',
			'value : new THREE.Vector3(0, 0, 0)',
		'},',
		'time : {',
			'type : "f",',
			'value : 1.0',
		'},',
		'resolution : {',
			'type : "v2",',
			'value : new THREE.Vector2()',
		'},',
'		uvScale : {',
			'type : "v2",',
			'value : new THREE.Vector2(3.0, 1.0)',
		'},',
		'texture1 : {',
			'type : "t",',
			'value : THREE.ImageUtils.loadTexture("images/cloud.png")',
'		},',
		'texture2 : {',
			'type : "t",',
			'value : THREE.ImageUtils.loadTexture("images/icetile.png")',
		'}',
	'};',
	'uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping;',
	'uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping;',
	'var size = 0.65;',
	'material = new THREE.ShaderMaterial({',
		'uniforms : uniforms,',
		'vertexShader : glsl_vertex_shader,',
		'fragmentShader : glsl_fragment_shader',
	'});',
	'var res = 32;',
	'if (view == "torus") {',
		'mesh = new THREE.Mesh(new THREE.TorusGeometry(size, 0.3, res, res), material);',
		'mesh.rotation.x = 0.3;',
		'scene.add(mesh);',
	'} else	if (view == "sphere") {',
		'mesh = new THREE.Mesh(new THREE.SphereGeometry ( size *1.5, res, res, 0, 2*Math.PI, 0, Math.PI) , material);',
		'scene.add(mesh);',
	'} else  if(view = "plane") {',
		'var geometry = new THREE.Geometry();',
		'geometry.vertices.push(new THREE.Vector3(-1, -1, 0));',
		'geometry.vertices.push(new THREE.Vector3(1, -1, 0));',
		'geometry.vertices.push(new THREE.Vector3(1, 1, 0));',
		'geometry.vertices.push(new THREE.Vector3(-1, 1, 0));',
		'geometry.faces.push(new THREE.Face4(0, 1, 2, 3));',
		'var s = viewportWidth / 512.0;',
		'var t = viewportHeight / 512.0;',
		'geometry.faceVertexUvs[0].push([new THREE.UV(0, t), new THREE.UV(s, t), new THREE.UV(s, 0), new THREE.UV(0, 0)]);',
		'mesh = new THREE.Mesh(geometry, material);',
		'scene.add(mesh);',
	'}',
	'renderer.autoClear = false;',
'	var renderModel = new THREE.RenderPass(scene, camera);',
	'var effectBloom = new THREE.BloomPass(1.25);',
	'var effectFilm = new THREE.FilmPass(0.35, 0.5, 4096, false);',
	'effectFilm.renderToScreen = true;',
	'composer = new THREE.EffectComposer(renderer);',
	'composer.addPass(renderModel);',
	bloom_code,
	film_code,
'}',
'function animate() {',
	'requestAnimationFrame(animate);',
	'render();',
'}',
'function render() {',
	'var delta = 5 * clock.getDelta();',
	'uniforms.time.value += 0.2 * delta;',
	'if (view == "torus") {',
		'mesh.rotation.y += 0.0125 * delta;',
		'mesh.rotation.x += 0.05 * delta;',
	'}else 	if (view == "sphere") {',
		'mesh.rotation.y += 0.02 * delta;',
	'}',
	'renderer.clear();',
	'composer.render(0.01);',
	'renderer.render(scene, camera);',
'}' ].join("\n");    //"</script> <script src='js/shader_backend.js'></script><script>";
        // $.get('http://127.0.0.1/campus_conquest/tools/js/shader_backend.js', function(data) {
		    // alert("working");
		    // init_code = data;
		// });
// 		
		


        jsCode = glslCodeInJS + init_code + jsCode; //   XXX
        
        return [jsCode, libs, info];
    }

    /*
     
    */
    function createHTML() {
        var width = 600;
        var height = 400;
      
        var resultTemplateHTML = ' \
            <html><head> \
                <script src="http://webglplayground.net/js/RequestAnimationFrame.js"></script> \
                <!--<meta charset=utf-8>--> \
                <style type="text/css"> \
                    body {margin:0px;} \
                    #canvas { \
                        /*border: 1px dotted #aaa;*/ \
                        padding: 0px; \
                        /*width:' + width + 'px; \
                        height:' + height + 'px;*/ \
                    } \
                </style> \
            </head> \
            <body> \
                <div id="canvas"></div> \
                <script type="text/javascript">var viewportWidth = ' + width + ';</script> \
                <script type="text/javascript">var viewportHeight = 400;</script> \
                <script type="text/javascript">var view = ' + cur_view + ';</script> \
                <script type="text/javascript">var containerId = "canvas";</script> \
                <script src="http://webglplayground.net/js/scriptContext.js"></script> \
                <script src="../js/lib/jQuery.js"></script> \
                <script type="text/javascript">$(document).ready(function(){ PLACEHOLDER_SCRIPT if (typeof frame==\'function\'){window.frame=frame;} else if (typeof Frame==\'function\'){window.frame=Frame;} });</script> \
                <script type="text/javascript">$(document).ready(function(){ scriptContext.Run(); });</script> \
            </body></html>';

                //<script type="text/javascript">var renderer; $(document).ready(function(){renderer = scriptContext.renderer;});</script> \

        //var script = createScript();
        var scriptAndLibsAndInfo = createScriptAndLibsAndInfo();
        var script = scriptAndLibsAndInfo[0];
        var libs = scriptAndLibsAndInfo[1];
        //var info = scriptAndLibsAndInfo[2];
        var resultHTML =  resultTemplateHTML.replace("PLACEHOLDER_SCRIPT", "var view = '" + cur_view + "'; PLACEHOLDER_SCRIPT ");
        resultHTML = resultHTML.replace("PLACEHOLDER_SCRIPT", script);
        
        for (var i=0; i<libs.length; i++) {
            resultHTML = resultHTML.replace("</head>", '<script src="'+libs[i]+'"></script> </head>');
        }
        
        return resultHTML;
    }

    //takes script code and runs it in an iframe
    var iframeWindow;
    function runCode() {
        resultHTML = createHTML();

        $('#result').remove();
        var iframe = $('<iframe>', {id: "result"}).insertAfter('#fps');//prependTo('#c2');
        iframeWindow = iframe.get(0).contentWindow;
        var doc = iframe.get(0).contentWindow.document;
        doc.open();
        doc.write(resultHTML);
        doc.close();
        window.setTimeout(updateFPS, 200);
    }
    
    function updateFPS() {
        if (iframeWindow.scriptContext) {
            fpsElement.text("FPS: "+Math.round(iframeWindow.scriptContext.GetFPS()));
        }
        window.setTimeout(updateFPS, 500);
    }

    //helper function, turns a hash into a string of javascript variables
    //hash contains name => string of code which can contain multiple \n
    function createJSArrayString(hash) {
        var jsString = '';
        for (var key in hash) {
            var lines = hash[key].split("\n");
            lines.push('   '); // without this the glsl scripts had to end with a new line and 2 spaces
            jsString += 'var ' + key + ' = [';
            for (var i=0; i<lines.length; i++) {
                var line = lines[i];
                //line = line.replace(' ', '');
                if (line.length==0) {
                    // do nothing
                } else {
                    if (jsString[jsString.length-1]!='[') {
                        jsString += ',';
                    }
                    line = line.replace(/'/g, "\\'");
                    jsString += "'" + line + "'";
                    //jsString += "'" + lines[i] + "'";
                }
            }
            jsString += '].join("\\n");\n';
        }
        return jsString;
    }
    
    //highlights all script lines starting with @
    function highlightShaderTitles() {
        // need to clear previous highlights because in some cases
        // code mirror does not do it by itself
        for (var i=0; i<prevHighlightedLines.length; i++) {
            editor.setLineClass(prevHighlightedLines[i], '');
        }
        prevHighlightedLines = [];
        var cursor = editor.getSearchCursor("@");
        while (cursor.findNext()) {
            var position = cursor.from();
            editor.setLineClass(position.line, 'shaderTitleLine');
            prevHighlightedLines.push(position.line);
        }
    }

    // from: http://stackoverflow.com/questions/901115/get-query-string-values-in-javascript/5158301#5158301
    // and: http://james.padolsey.com/javascript/bujs-1-getparameterbyname/
    function getParameterByName(name) {
    
        var match = RegExp('[?&]' + name + '=([^&]*)')
                        .exec(window.location.search);
    
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    
    }
    
    function getIdIfExists() {
        var match = RegExp('/saved/([^/]+)').exec(window.location.href);
        if (match==null) {
            return '';
        } else {
            return match[1]; // match[0] contains the whole matched string
        }
    }
}
);//(); // ready

//Object.prototype.toString.call(chunkNames)