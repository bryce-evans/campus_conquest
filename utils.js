module.exports = {
  
  /* writes <string> data to <response> res
     as a json
  */
  writeData : function(res, data) {
    var json = JSON.stringify(data);
    res.writeHead(200, {
      'content-type' : 'application/json',
      'content-length' : Buffer.byteLength(json)
    });
    res.end(json);
  },
 /*
    used for applying one argument at a time to a function
    used for attaching args to a callback function
 */
curry : function(func) {
  var applied = Array.prototype.slice.call(arguments, 1);
  return function() {
    var args = applied.concat(Array.prototype.slice.call(arguments));
    return func.apply(this, args);
  };
},
}
