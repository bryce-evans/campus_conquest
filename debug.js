module.exports = {

  logAllMethodsOf : function(object) {
    var list = Object.getOwnPropertyNames(object).filter(function(property) {
      return typeof object[property] == 'function';
    });
    console.log(list);
  },
}
