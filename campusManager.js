var fs = require('fs');

CampusManager = function() {
  this.campuses = {};
}
CampusManager.prototype = {
  campus_directory : "public/rsc/campuses/",
  load : function(id) {
//    if (id === "example") return;
    if (id in this.campuses) {
      return;
    }
    var campus = new CampusData();
    campus.load(id);   
    this.campuses[id] = campus;
  },
  loadAll : function() {
    getDirs(this.campus_directory, function(dir_list) {
      for (var i = 0; i< dir_list.length; i++) {
        this.load(dir_list[i]);
      }
    }.bind(this));
  },
  getCampusData : function(id) {
    if(!(id in this.campuses)) {
      console.error('attempted to retrieve campus from invalid id');
    }
    return this.campuses[id];
  },
  campusExists : function(id) {
    return id in this.campuses;
  },
}

CampusData = function() {
  // true when all info has loaded
  this.loaded = false;
  this.id;
  this.info;
  this.map;
  this.team_data;

  // list of functions to execute after all data is loaded
  this.todo_on_loaded = [];
}
CampusData.prototype = {
  load : function(id) {
    this.id = id;
    function onComplete() {
      this.loaded = true;
      for (var i = 0; i < this.todo_on_loaded; i++) {
        var fn = this.todo_on_loaded[i];
        fn();
      }
    };
    
    var dir = "public/rsc/campuses/" + id + "/";
    this.files_remaining = 3;
 
    fs.readFile(dir + "info.json", 'utf8', function (err, data) {
      if (err) throw err;
      this.info = JSON.parse(data);
      this.files_remaining--;
      if (this.files_remaining === 0) {
        onComplete();
      }
    }.bind(this));

    fs.readFile(dir + "map.json", 'utf8', function (err, data) {
      if (err) throw err;
      this.map = JSON.parse(data);
      this.files_remaining--;
      if (this.files_remaining === 0) {
        onComplete();
      }
    }.bind(this));

    fs.readFile(dir + "team_data.json", 'utf8', function (err, data) {
      if (err) throw err;
      this.team_data = JSON.parse(data);
      this.files_remaining--;
      if (this.files_remaining === 0) {
        onComplete();
      }
    }.bind(this));
  },
  getID : function() {
    return this.id;
  },
  getName : function() {
    return this.info.name;
  },
  getFullName : function() {
    return this.info.full_name;
  },
  getDescription : function() {
    return this.info.description;
  },
  getMap : function() {
    return this.map;
  },
  getTeamList : function() {
    return Object.keys(this.team_data);
  },
  getPieceList : function() {
    return Object.keys(this.map.pieces);
  },
  getWeightBetween : function(piece_id1, piece_id2) {
    return this.map.pieces[piece_id1][piece_id2];
  },
  executeOnLoad : function(fn) {
    if (this.loaded) {
      fn();
    } else {
      this.todo_on_load.push(fn);
    }
  },
}

var getDirs = function(rootDir, cb) { 
    fs.readdir(rootDir, function(err, files) { 
        var dirs = []; 
        var remaining = files.length;
        for (var index = 0; index < files.length; ++index) { 
            var file = files[index]; 
            if (file[0] !== '.') { 
                var filePath = rootDir + file; 
                fs.stat(filePath, function(err, stat) {
                    if (stat.isDirectory()) { 
                        dirs.push(this.file); 
                    } 
                    remaining--;
                    if (remaining === 0) { 
                        return cb(dirs); 
                    } 
                }.bind({file : file})); 
            }
        }
    });
}  
module.exports = CampusManager;
