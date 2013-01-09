CodeMirror.defineMode("editor", function(config, parserConfig) {
    
    var jsMode = CodeMirror.getMode(config, "javascript");
    //var cMode = CodeMirror.getMode(config, "text/x-csrc", {matchBrackets: true});
    var cMode = CodeMirror.getMode(config, "text/x-glsl", {matchBrackets: true});
    
    function javascript(stream, state) {
        //if (stream.match(/^\s*@/i)) {
        //    state.token = c;
        //        //state.cState = cMode.startState();
        //        //return c(stream, state);
        //    stream.skipToEnd();
        //    return null;
        //        //return 'krychu';
        //}
        //return jsMode.token(stream, state.jsState);
        return tokenChange(jsMode, state.jsState, stream, state);
    }
    
    function c(stream, state) {
        //if (stream.match(/^\s*@/i)) {
        //    stream.skipToEnd();
        //    return null;
        //}
        //return cMode.token(stream, state.cState);
        return tokenChange(cMode, state.cState, stream, state);
    }
    
    function libs(stream, state) {
        return tokenChange(null, null, stream, state);
    }
    
    //function libs(stream, state) {
    //    if (stream.match(/^\s*))
    //}

    function tokenChange(mode, modeState, stream, state) {
        if (stream.match(/^\s*@glsl/i, false) || stream.match(/^\s*@glsl/i, false))  {
            state.token = c;
            stream.skipToEnd();
            return null;
        } else if (stream.match(/^\s*@main/i, false)) {
            state.token = javascript;
            stream.skipToEnd();
            return null;
        } else if (stream.match(/^\s*@libs/i, false) || stream.match(/^\s*@info/i, false)) {
            state.token = libs;
            stream.skipToEnd();
            return null;
        }
        
        // if mode == null we are in the @libs section
        if (mode!=null) {
            return mode.token(stream, modeState);
        } else {
            stream.skipToEnd();
            return null;
        }
    }
    
    // return mode object
    return {
        startState: function() {
            var jsState = jsMode.startState();
            var cState = cMode.startState();
            return {token: javascript, jsState: jsState, cState: cState};
        },
        
        copyState: function(state) {
            var stateCopy = {token:state.token, jsState:CodeMirror.copyState(jsMode,state.jsState), cState:CodeMirror.copyState(cMode,state.cState)};
            return stateCopy;
        },
        
        token: function(stream, state) {
            return state.token(stream, state);
        },
        
        indent: function(state, textAfter) {
            if (state.token == javascript) {
                return jsMode.indent(state.jsState, textAfter);
            } else if (state.token == c) {
                var i = cMode.indent(state.cState, textAfter);
                return i;
            } else if (state.token == libs) {
                return 0;   
            } else {
                alert("ups");
            }
        },
        
        electricChars: "}"
    }
    
});