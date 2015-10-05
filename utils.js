module.exports = {

  /* writes <Object> data to <response> res
   as a JSON String
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
  /**
   Fisher-Yates Shuffle
   @author: Mike Bostock
   http://bost.ocks.org/mike/shuffle/

   shuffles an array in-place
   */
  shuffle : function(array) {

    var m = array.length, t, i;

    // While there remain elements to shuffle.
    while (m) {

      // Pick a remaining element.
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;

  }
}
