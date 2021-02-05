var fs = require('fs')

var removeFileExtension = function (file) {
  var fileName = file.split('/');
  return fileName[fileName.length - 1].split('.')[0];
};

var listFiles = function (dir) {
  try {
    return fs.readdirSync(dir).map(function (fileName) {
      return dir + '/' + fileName
    })
  } catch(err) {
    return []
  }
};

var imageFiles = function () { return listFiles('resources/images'); }
var soundFiles = function () { return listFiles('resources/sounds'); }

module.exports = {
  compile: {
    options: {
      pretty: true,
      data: {
        images: imageFiles(),
        sounds: soundFiles(),
        removeFileExtension: removeFileExtension,
        quickSrc: "bin/quick-3.0.0.js"
      }
    },
    files: {
      "index.html": ["resources/index.jade"]
    }
  }
}
