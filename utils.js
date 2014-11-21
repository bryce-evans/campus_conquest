
module.exports = {
  writeData : function(res, data) {
    console.log('data', data);
    var json = JSON.stringify(data);
    res.writeHead(200, {
      'content-type' : 'application/json',
      'content-length' : Buffer.byteLength(json)
    });
    res.end(json);
  }
}