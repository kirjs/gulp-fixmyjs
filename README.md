# gulp-fixmyjs
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]


> [fixmyjs](https://github.com/jshint/fixmyjs) plugin for [gulp](https://github.com/wearefractal/gulp)

## Usage

First, install `gulp-fixmyjs` as a development dependency:

```shell
npm install --save-dev gulp-fixmyjs
```

Then, add it to your `gulpfile.js`:

```javascript
var fixmyjs = require("gulp-fixmyjs");

gulp.src("./src/*.js")
	.pipe(fixmyjs({
		// JSHint settings here
	}))
	.pipe(gulp.dest("./src"));
```

## API

### fixmyjs(options)

#### options.legacy
Type: **Boolean**, Default: false

Enables legacy mode

#### options.lookup
Type: **Boolean**, Default: true

Enables looking up the .jshintrc configuration file

#### JSHint options
Any of the [JSHint options](http://www.jshint.com/docs/options/) will be passed to fixmyjs, and would get precedence over .jshintrc file



## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-fixmyjs
[npm-image]: https://badge.fury.io/js/gulp-fixmyjs.svg

[travis-url]: http://travis-ci.org/kirjs/gulp-fixmyjs
[travis-image]: https://secure.travis-ci.org/kirjs/gulp-fixmyjs.svg?branch=master

[coveralls-url]: https://coveralls.io/r/kcherkashin/gulp-fixmyjs
[coveralls-image]: https://img.shields.io/coveralls/kcherkashin/gulp-fixmyjs.svg

[depstat-url]: https://david-dm.org/kirjs/gulp-fixmyjs
[depstat-image]: https://david-dm.org/kirjs/gulp-fixmyjs.svg
