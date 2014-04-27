var through = require("through2"),
    gutil = require("gulp-util"),
    fixmyjs = require("fixmyjs");

module.exports = function(param) {
    "use strict";

    // if necessary check for required param(s), e.g. options hash, etc.
    if (!param) {
        throw new gutil.PluginError("gulp-fixmyjs", "No param supplied");
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

        // check if file.contents is a `Buffer`
        if (file.isBuffer()) {
            file.contents = new Buffer(fixmyjs.fix(String(file.contents), {}));
            this.push(file);
        }
        return callback();
    }

    return through.obj(gulpFixmyjs);
};