var fs = require('fs');
var crypto = require('crypto');

var imgPath = './img';
var imgPrefix = 'slide_';
var md5 = function(text) {
  return crypto.createHash('md5').update(text).digest('hex');
};
var formatImageNames = function(next) {
    var fileNames = [];
    fs.readdir(imgPath, function(err, files) {
        files.forEach(function(fileName) {
            if (!fileName.startsWith(imgPrefix)) {
                var newName = imgPrefix + md5(fileName) + '.jpg';
                console.log(fileName + ' => ' + newName);
                fs.renameSync(imgPath + '/' + fileName, imgPath + '/' + newName);
                fileNames.push(newName);
            } else {
                fileNames.push(fileName);
            }
        });
        next(fileNames);
    });
};

var renderIndex = function() {
    var data = {};

    formatImageNames(function(names) {
        data.imgNamesStr = "'" + names.join("','") + "'";
        render('./index.html', data);
    });
}
var render = function(viewName, data) {
    var templatePath = viewName + '.temp';
    var view = fs.readFileSync(templatePath, 'utf8');
    Object.keys(data).forEach(function(key) {
        view = view.replace('{' + key +'}', data[key]);
    });
    fs.writeFileSync(viewName, view, 'utf8');
    console.log('render ' + viewName + ' done!');
}

// formatImageNames(function(names) {
//     console.log('=======');
//     console.dir(names);
// });

renderIndex();