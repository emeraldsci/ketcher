/****************************************************************************
 * Copyright 2018 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ***************************************************************************/
const gulp = require('gulp');
const minimist = require('minimist');
const pkg = require('./package.json');
const download = require("gulp-download");
const unzip = require('gulp-unzip')
const fileExists = require('file-exists');
const runSequence = require('run-sequence');
const pathExists = require('path-exists');
var untar = require('gulp-untar')

const iconsPath = 'src/icons/*.svg';

const options = minimist(process.argv.slice(2), {
	string: ['dist', 'api-path', 'build-number', 'build-date', 'miew-path'],
	default: {
		'dist': 'dist',
		'api-path': '',
		'miew-path': null,
		'build-number': '',
		'build-date': new Date().toISOString().slice(0, 19)
	}
});

function getTask(path, options) {
	return function(callback) {
		let task = options.expName ? require(path)[options.expName] : require(path);
		return task(options, callback);
	};
}

/*== test ==*/
gulp.task('test-render', getTask('./gulp/tests', {
	expName: 'testRender',
	entry: 'test/render/render-test.js',
	banner: 'src/script/util/banner.js'
}));

gulp.task('test-io', getTask('./gulp/tests', {
	expName: 'testIO'
}));

/*== styles ==*/
gulp.task('icons-svg', getTask('./gulp/style-html', {
	expName: 'iconsSvg',
	src: ['src/icons/*.svg'],
	dist: options.dist
}));

gulp.task('style', ['icons-svg'], getTask('./gulp/style-html', {
	expName: 'style',
	src: 'src/style/index.less',
	pkg: pkg,
	dist: options.dist
}));

/*== script ==*/
gulp.task('script', ['patch-version'], getTask('./gulp/prod-script', Object.assign({
	expName: 'script',
	pkg: pkg,
	entry: 'src/script',
	banner: 'src/script/util/banner.js'
}, options)));

gulp.task('html', ['patch-version'], getTask('./gulp/style-html', Object.assign({
	expName: 'html',
	src: 'src/template/index.hbs',
	pkg: pkg
}, options)));

/*== assets ==*/
gulp.task('doc', function () {
	return gulp.src('doc/*.{png, jpg, gif}')
		.pipe(gulp.dest(options.dist + '/doc'));
});

gulp.task('help', ['doc'], getTask('./gulp/assets', {
	expName: 'help',
	src: 'doc/help.md',
	dist: options.dist
}));

gulp.task('logo', function () {
	return gulp.src('src/logo/*')
		.pipe(gulp.dest(options.dist + '/logo'));
});

gulp.task('copy', ['logo'], getTask('./gulp/assets', {
	expName: 'copy',
	dist: options.dist,
	'miew-path': options['miew-path'],
	distrib: ['LICENSE', 'src/template/demo.html', 'src/tmpl_data/library.sdf', 'src/tmpl_data/library.svg']
}));

/*== version ==*/
gulp.task('patch-version', getTask('./gulp/utils', {
	expName: 'version',
	pkg: pkg
}));

/*== check ==*/
gulp.task('lint', getTask('./gulp/check', {
	expName: 'lint',
	src: 'src/script/**'
}));

gulp.task('clean', getTask('./gulp/clean', {
	dist: options.dist,
	pkgName: pkg.name
}));

gulp.task('pre-commit', []);
gulp.task('assets', ['copy', 'help']);
gulp.task('code', ['style', 'script', 'html']);

gulp.task('copy-package-info', function(){
	return gulp.src('package.json')
		.pipe(gulp.dest('./dist/'));
});

gulp.task('copy-toolbar-configuration', function(){
	return gulp.src('./toolbar_configuration.json')
		.pipe(gulp.dest('./dist/'));
});

gulp.task('copy-shortcut-configuration', function(){
	return gulp.src('./shortcut_configuration.json')
		.pipe(gulp.dest('./dist/'));
});

gulp.task('copy-stylesheet', function(){
	return gulp.src('./stylesheet.json')
		.pipe(gulp.dest('./dist/'));
});

gulp.task('download-nwjs', function(){
	return Promise.all([
		pathExists('./nwjs-v0.29.4-win-x64').then(
			exists => {
				if(!exists){
					download("https://dl.nwjs.io/v0.29.4/nwjs-v0.29.4-win-x64.zip")
						.pipe(unzip())
						.pipe(gulp.dest("./"));
				}
			}
		)
	]).then(function() {
		return gulp.src('./nwjs-v0.29.4-win-x64/**/*')
			.pipe(gulp.dest('./dist/'));
	});
});

/*== dev ==*/
gulp.task('serve', ['clean', 'style', 'html', 'assets', 'copy-toolbar-configuration', 'copy-shortcut-configuration', 'copy-stylesheet'], getTask('./gulp/dev-script', Object.assign({
	entry: 'src/script',
	pkg: pkg
}, options)));

/*== production ==*/
gulp.task('build', ['clean', 'style', 'html', 'code', 'assets', 'copy-package-info', 'download-nwjs', 'copy-toolbar-configuration', 'copy-shortcut-configuration', 'copy-stylesheet']);

gulp.task('archive', ['build'], getTask('./gulp/prod-script', {
	expName: 'archive',
	pkg: pkg,
	dist: options.dist
}));
