$(document).ready(
function() {
    
    var editor;
    var prevHighlightedLines = [];

    plug();
    runCode();

    window.editor = editor;

    function plug() {

        // plug editor
        editor = CodeMirror.fromTextArea(document.getElementById("editor"), { //$('#editor').get(0), {

            mode: "editor",
             
		    gutters: ["note-gutter", "CodeMirror-linenumbers"],
		    lineNumbers: true,
 
            //lineNumbers: true,
            onChange: function() { // on each keystroke
                // highlight @ lines
                highlightShaderTitles();
             
            }
        });
        highlightShaderTitles();
        
        if (typeof(rawScript) !== 'undefined') {
            editor.setValue(rawScript);
        }


        // plug button Run
        $('#run').click(function(event) {
            runCode();
        });


        
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
        
        var resultTemplateHTML = "";

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
        // for (var i=0; i<prevHighlightedLines.length; i++) {
            // editor.setLineClass(prevHighlightedLines[i], '');
        // }
        prevHighlightedLines = [];
        var cursor = editor.getSearchCursor("@");
        while (cursor.findNext()) {
            var position = cursor.from();
            // editor.setLineClass(position.line, 'shaderTitleLine');
            // editor.markText(position.line, ' ');
           // editor.className('shaderTitleLine');
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
);