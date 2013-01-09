CodeMirror.defineMode("editor", function(config, parserConfig) {
    
    var jsMode = CodeMirror.getMode(config, "javascript");

    
    function javascript(stream, state) {
        return tokenChange(jsMode, state.jsState, stream, state);
    }

    
    function libs(stream, state) {
        return tokenChange(null, null, stream, state);
    }


    function tokenChange(mode, modeState, stream, state) {
		if (stream.match(/^\s*@main/i, false)) {
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
            return {token: javascript, jsState: jsState};
        },
        
        copyState: function(state) {
            var stateCopy = {token:state.token, jsState:CodeMirror.copyState(jsMode,state.jsState)};
            return stateCopy;
        },
        
        token: function(stream, state) {
            return state.token(stream, state);
        },
        
        indent: function(state, textAfter) {
            if (state.token == javascript) {
                return jsMode.indent(state.jsState, textAfter);
            } else if (state.token == libs) {
                return 0;   
            } else {
                alert("ups");
            }
        },
        
        electricChars: "}"
    }
    
});