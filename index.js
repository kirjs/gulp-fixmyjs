var through = require("through2"),
  gutil = require("gulp-util"),
  fixmyjs = require("fixmyjs"),
  RcLoader = require('rcloader'),
  jshint = require('jshint').JSHINT;

module.exports = function (options) {
  "use strict";

  options = options || {};
  if (options.lookup === void 0) {
    options.lookup = true;
  }
  if (options.legacy === void 0) {
    options.legacy = false;
  }

  if (options.lookup) {
    var rcLoader = new RcLoader('.jshintrc', options, {});
  }

  var fixJS = function (contents, config) {
    return fixmyjs.fix(contents, config);
  };


  if (options.legacy) {
    fixJS = function (contents, config) {
      jshint(contents, config);
      return fixmyjs(jshint.data(), contents, config).run();
    };
  }


  function error(message) {
    return new gutil.PluginError("gulp-fixmyjs", message);
  }

  function gulpFixmyjs(file, enc, callback) {
    /*jshint validthis:true*/


    // Do nothing if no contents
    if (file.isNull()) {
      this.push(file);
      return callback();
    }


    if (file.isStream()) {
      this.emit("error", error("Stream content is not supported"));
      return callback();
    }


    if (file.isBuffer()) {
      var fix = function (err, config) {
        if (err) {
          this.emit("error", error("Error when reading .jshint config:\n" + err));
        } else {
          try {
            file.contents = new Buffer(fixJS(String(file.contents), config));
            this.push(file);
          } catch (e) {
            this.emit("error", error("Error when running fixmyjs:\n" + e.stack));
          }
        }
        return callback();
      }.bind(this);


      if (options.lookup) {
        rcLoader.for(file.path, fix);
      } else {
        fix(null, options);
      }


    }
  }


  return through.obj(gulpFixmyjs);
};
