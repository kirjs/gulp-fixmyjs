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
  if (options.lagacy === void 0) {
    options.lagacy = false;
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


  function gulpFixmyjs(file, enc, callback) {
    /*jshint validthis:true*/


    // Do nothing if no contents
    if (file.isNull()) {
      this.push(file);
      return callback();
    }


    if (file.isStream()) {
      this.emit("error",
        new gutil.PluginError("gulp-fixmyjs", "Stream content is not supported"));
      return callback();
    }


    if (file.isBuffer()) {
      var fix = function (err, config) {
        try {
          file.contents = new Buffer(fixJS(String(file.contents), config));
          this.push(file);
        } catch (e) {
          this.emit("error", new gutil.PluginError("gulp-fixmyjs", "Error when running fixmyjs:", e));
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