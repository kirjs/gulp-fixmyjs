/*global describe, it*/
"use strict";

var fs = require("fs"),
  es = require("event-stream"),
  should = require("should");

require("mocha");

delete require.cache[require.resolve("../")];

var gutil = require("gulp-util"),
  fixmyjs = require("../");

describe("gulp-fixmyjs", function () {

  var expectedFile = new gutil.File({
    path: "test/expected/after.js",
    cwd: "test/",
    base: "test/expected",
    contents: fs.readFileSync("test/expected/after.js")
  });

  it("should produce expected file via buffer", function (done) {

    var srcFile = new gutil.File({
      path: "test/fixtures/before.js",
      cwd: "test/",
      base: "test/fixtures",
      contents: fs.readFileSync("test/fixtures/before.js")
    });

    var stream = fixmyjs({lookup: false});

    stream.on("error", function (err) {
      should.exist(err);
      done(err);
    });

    stream.on("data", function (newFile) {

      should.exist(newFile);
      should.exist(newFile.contents);

      String(newFile.contents).should.equal(String(expectedFile.contents));
      done();
    });

    stream.write(srcFile);
    stream.end();
  });


  describe("handling js hint parameters", function () {

    it("Doesn't not replace == to === if eqeqeq is false", function (done) {
      var expectedFileNoEqEqEq = new gutil.File({
        path: "test/expected/afterNoEqEqEq.js",
        cwd: "test/",
        base: "test/expected",
        contents: fs.readFileSync("test/expected/afterNoEqEqEq.js")
      });

      var srcFile = new gutil.File({
        path: "test/fixtures/before.js",
        cwd: "test/",
        base: "test/fixtures",
        contents: fs.readFileSync("test/fixtures/before.js")
      });

      var stream = fixmyjs({lookup: false, eqeqeq: false});

      stream.on("error", function (err) {
        should.exist(err);
        done(err);
      });

      stream.on("data", function (newFile) {

        should.exist(newFile);
        should.exist(newFile.contents);

        String(newFile.contents).should.equal(String(expectedFileNoEqEqEq.contents));
        done();
      });

      stream.write(srcFile);
      stream.end();
    });
    it("Does replace == to === if eqeqeq is true", function (done) {
      var expectedFileEqEqEq = new gutil.File({
        path: "test/expected/afterEqEqEq.js",
        cwd: "test/",
        base: "test/expected",
        contents: fs.readFileSync("test/expected/afterEqEqEq.js")
      });

      var srcFile = new gutil.File({
        path: "test/fixtures/before.js",
        cwd: "test/",
        base: "test/fixtures",
        contents: fs.readFileSync("test/fixtures/before.js")
      });

      var stream = fixmyjs({lookup: false, eqeqeq: true});

      stream.on("error", function (err) {
        should.exist(err);
        done(err);
      });

      stream.on("data", function (newFile) {
        should.exist(newFile);
        should.exist(newFile.contents);
        String(newFile.contents).should.equal(String(expectedFileEqEqEq.contents));
        done();
      });

      stream.write(srcFile);
      stream.end();
    });

  });

  it("should error on invalid JS", function (done) {

    var srcFile = new gutil.File({
      path: "test/fixtures/invalid.js",
      cwd: "test/",
      base: "test/fixtures",
      contents: fs.readFileSync("test/fixtures/invalid.js")
    });

    var stream = fixmyjs({lookup: false});
    stream.on("error", function (err) {
      should.exist(err);
      done();
    });

    stream.on("data", function (newFile) {
      newFile.contents.pipe(es.wait(function (err, data) {
        done(err);
      }));
    });

    stream.write(srcFile);
    stream.end();
  });

  it("should error on stream", function (done) {

    var srcFile = new gutil.File({
      path: "test/fixtures/before.js",
      cwd: "test/",
      base: "test/fixtures",
      contents: fs.createReadStream("test/fixtures/before.js")
    });

    var stream = fixmyjs({lookup: false});

    stream.on("error", function (err) {
      should.exist(err);
      done();
    });

    stream.on("data", function (newFile) {
      newFile.contents.pipe(es.wait(function (err, data) {
        done(err);
      }));
    });

    stream.write(srcFile);
    stream.end();
  });
});