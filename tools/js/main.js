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

$(document).ready(
function() {
    
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

        ///* OVERLAYS
        // *
        // * create all overlays (but don't show them)
        // */
        //$('#save_saving_overlay').overlay({
        //    closeOnClick: false,
        //    closeOnEsc: false,
        //    mask: {
        //        color: '#777777',
        //        loadSpeed: 200,
        //        opacity: 0.7
        //    }
        //});
        //$('#share_overlay').overlay({
        //    mask: {
        //        color: '#777777',
        //        loadSpeed: 200,
        //        opacity: 0.7
        //    }
        //});
        //$('#contribute_overlay').overlay({
        //    mask: {
        //        color: '#777777',
        //        loadSpeed: 200,
        //        opacity: 0.7
        //    }
        //});
        //$('#submitting_overlay').overlay({
        //    closeOnClick: false,
        //    closeOnEsc: false,
        //    mask: {
        //        color: '#777777',
        //        loadSpeed: 200,
        //        opacity: 0.7
        //    }
        //});
        //$('#save_nochanges_overlay').overlay({
        //    mask: {
        //        color: '#777777',
        //        loadSpeed: 200,
        //        opacity: 0.7
        //    }
        //});
        //$('#save_overlay').overlay({
        //    mask: {
        //        color: '#777777',
        //        loadSpeed: 200,
        //        opacity: 0.7
        //    }
        //});
        
        // plug button Run
        var view = "plane";
        $('#run').click(function(event) {
            runCode();
        });


        //// plug button Save
        //$('#save_button').click(function(event){
        //    event.preventDefault();
        //    
        //    if (doesNotNeedSaving) {
        //        $('#save_nochanges_overlay').data('overlay').load();
        //    } else {
        //        //send stuff to server
        //        var rawScript = editor.getValue();
        //        //var script = createScript();
        //        //var scriptAndLibs = createScript();
        //        //var script = scriptAndLibs[0];
        //        //var libs = scriptAndLibs[1];
        //        $.ajax({
        //            type: 'POST',
        //            url: baseURL + '/save',
        //            data: {
        //                    'rawScript': rawScript,
        //                    //'script': script,
        //                    'html': createHTML(),
        //                    //'saved': saved,
        //                    'savedId': saved_id
        //                },
        //            success: function(data) {
        //                $('#save_saving_overlay').data("overlay").close();
        //                window.location = data['url'];
        //                //saved = 1;
        //                //window.saved_id = data['id'];
        //            }
        //        });
        //        
        //        $('#save_saving_overlay').data('overlay').load();
        //    }
        //});
        //
        //// plug share button
        ///*$('#share_button').overlay({
        //    mask: {
        //        color: '#777777',
        //        loadSpeed: 200,
        //        opacity: 0.7
        //    }
        //});*/
        //
        //$('#share_button').click(function(event){
        //    event.preventDefault();
        //    if (doesNotNeedSaving) {
        //        $('#share_overlay').data('overlay').load();
        //    } else {
        //        $('#save_overlay').data('overlay').load();
        //    }
        //});
        //
        //$('#contribute_button').click(function(event){
        //    event.preventDefault();
        //    if (doesNotNeedSaving) {
        //        $('#contribute_taurl').val(window.location.href);
        //        $('#contribute_overlay').data('overlay').load();
        //    } else {
        //        $('#save_overlay').data('overlay').load();
        //    }
        //});
        //// contribute submit button
        //$('#contribute_submit').click(function(event){
        //    event.preventDefault();
        //    
        //    if (doesNotNeedSaving) {
        //        var projectAddress = $('#contribute_taurl').val();
        //        var projectType = $('input[type="radio"]:checked').val();
        //        var author = $('#contribute_taauthor').val();
        //        var info = $('#contribute_tainfo').val();
        //        
        //        $.ajax({
        //            type: 'POST',
        //            url: baseURL + '/contribute',
        //            data: {
        //                    'projectAddress': projectAddress,
        //                    'projectType': projectType,
        //                    'author': author,
        //                    'info': info,
        //                    'savedId': saved_id,
        //                    //'script': script,
        //                    'html': createHTML()
        //                },
        //            success: function(data) {
        //                $('#submitting_overlay').data('overlay').close();
        //                canBeContributed = false;
        //            }
        //        });
        //        $('#submitting_overlay').data('overlay').load();
        //    } else {
        //        $('#save_overlay').data('overlay').load();
        //    }
        //});
        //
        //        
        //// plug button Fork
        //$('#fork_button').click(function(event){
        //    event.preventDefault();
        //    newWindow = window.open(baseURL + '/?fork=1');
        //    newWindow.rawScript = editor.getValue();
        //});
        
        // plug all email addresses
        $(".contributeemail").text("contact" + [',','@','#'][1] + "webglplayground" + ['.net', '.info'][3*4-12]);
        $(".supportemail").text("contact" + [',','@','#'][1] + "webglplayground" + ['.net', '.info'][3*4-12]);
    }

    // creates code of the script
    function createScriptAndLibsAndInfo() {
        text = editor.getValue();
        
        var jsCode = undefined;
        //var vsCode = {};
        //var fsCode = {};
        var glslCode = {};
        var libs = [];
        var info = ''
        
        var textChunks = text.split("@");
        //jsCode = textChunks[0];
        
        var anySectionFound = false;
        
        // populate jsCode, vsCode, fsCode, libs
        for (var i=0; i<textChunks.length; i++) {
            
            // is it a vertex shader?
            //chunkNames = textChunks[i].match(/^vs[_\d\w]*/i);
            //if (chunkNames!=null && chunkNames.length>0) {
            //    textChunks[i] = textChunks[i].replace(chunkNames[0], '');
            //    vsCode[chunkNames[0]] = textChunks[i];
            //    anySectionFound = true;
            //    //alert(chunkNames[0] + " = " + textChunks[i]);
            //    continue;
            //}
            
            // is it a fragment shader?
            //chunkNames = textChunks[i].match(/^fs[_\d\w]*/i);
            //if (chunkNames!=null && chunkNames.length>0) {
            //    textChunks[i] = textChunks[i].replace(chunkNames[0], '');
            //    fsCode[chunkNames[0]] = textChunks[i];
            //    //alert(chunkNames[0] + " = " + textChunks[i]);
            //    anySectionFound = true;
            //    continue;
            //}

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
                jsCode = textChunks[i];
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
        jsCode = glslCodeInJS + jsCode;
        
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
                <script type="text/javascript">var viewportHeight = ' + height + ';</script> \
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
        var resultHTML = resultTemplateHTML.replace("PLACEHOLDER_SCRIPT", script);
        
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