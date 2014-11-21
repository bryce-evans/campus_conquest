module.exports = {
  writeData : function(res, data) {
    var json = JSON.stringify(data);
    res.writeHead(200, {
      'content-type' : 'application/json',
      'content-length' : Buffer.byteLength(json)
    });
    res.end(json);
  },
  curry : function(func) {
    var applied = Array.prototype.slice.call(arguments, 1);
    return function() {
      var args = applied.concat(Array.prototype.slice.call(arguments));
      return func.apply(this, args);
    };
  },
}