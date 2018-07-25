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
const request = require('request');
const http = require('https');
const fs = require('fs-extra');
const pathExists = require('path-exists');
const decompress = require('decompress');

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

const options_mac = minimist(process.argv.slice(2), {
	string: ['dist', 'api-path', 'build-number', 'build-date', 'miew-path'],
	default: {
		'dist': './dist/nwjs.app/Contents/Resources/app.nw',
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

gulp.task('icons-svg-mac', getTask('./gulp/style-html', {
	expName: 'iconsSvg',
	src: ['src/icons/*.svg'],
	dist: options_mac.dist
}));

gulp.task('style', ['icons-svg'], getTask('./gulp/style-html', {
	expName: 'style',
	src: 'src/style/index.less',
	pkg: pkg,
	dist: options.dist
}));

gulp.task('style-mac', ['icons-svg-mac'], getTask('./gulp/style-html', {
	expName: 'style',
	src: 'src/style/index.less',
	pkg: pkg,
	dist: options_mac.dist
}));

/*== script ==*/
gulp.task('script', ['patch-version'], getTask('./gulp/prod-script', Object.assign({
	expName: 'script',
	pkg: pkg,
	entry: 'src/script',
	banner: 'src/script/util/banner.js'
}, options)));

gulp.task('script-mac', ['patch-version'], getTask('./gulp/prod-script', Object.assign({
	expName: 'script',
	pkg: pkg,
	entry: 'src/script',
	banner: 'src/script/util/banner.js'
}, options_mac)));

gulp.task('html', ['patch-version'], getTask('./gulp/style-html', Object.assign({
	expName: 'html',
	src: 'src/template/index.hbs',
	pkg: pkg
}, options)));

gulp.task('html-mac', ['patch-version'], getTask('./gulp/style-html', Object.assign({
	expName: 'html',
	src: 'src/template/index.hbs',
	pkg: pkg
}, options_mac)));

/*== assets ==*/
gulp.task('doc', function () {
	return gulp.src('doc/*.{png, jpg, gif}')
		.pipe(gulp.dest(options.dist + '/doc'));
});

gulp.task('doc-mac', function () {
	return gulp.src('doc/*.{png, jpg, gif}')
		.pipe(gulp.dest(options_mac.dist + '/doc'));
});

gulp.task('help', ['doc'], getTask('./gulp/assets', {
	expName: 'help',
	src: 'doc/help.md',
	dist: options.dist
}));

gulp.task('help-mac', ['doc-mac'], getTask('./gulp/assets', {
	expName: 'help',
	src: 'doc/help.md',
	dist: options_mac.dist
}));

gulp.task('logo', function () {
	return gulp.src('src/logo/*')
		.pipe(gulp.dest(options.dist + '/logo'));
});

gulp.task('logo-mac', function () {
	return gulp.src('src/logo/*')
		.pipe(gulp.dest(options_mac.dist + '/logo'));
});

gulp.task('copy', ['logo'], getTask('./gulp/assets', {
	expName: 'copy',
	dist: options.dist,
	'miew-path': options['miew-path'],
	distrib: ['LICENSE', 'src/template/demo.html', 'src/tmpl_data/library.sdf', 'src/tmpl_data/library.svg']
}));

gulp.task('copy-mac', ['logo-mac'], getTask('./gulp/assets', {
	expName: 'copy',
	dist: options_mac.dist,
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
gulp.task('assets-mac', ['copy-mac', 'help-mac']);
gulp.task('code', ['style', 'script', 'html']);
gulp.task('code-mac', ['style-mac', 'script-mac', 'html-mac']);

/*== copy dist contents ==*/

function copy (input,destination) {
	return function () {
		return gulp.src(input).pipe(gulp.dest(destination))
	}
}

gulp.task('copy-package-info', copy('package.json','./dist/'));
gulp.task('copy-package-info-mac', copy('package.json','./dist/nwjs.app/Contents/Resources/app.nw'));

gulp.task('copy-toolbar-configuration', copy('./toolbar_configuration.json','./dist/'));
gulp.task('copy-toolbar-configuration-mac', copy('./toolbar_configuration.json','./dist/nwjs.app/Contents/Resources/app.nw'));

gulp.task('copy-shortcut-configuration', copy('./shortcut_configuration.json','./dist/'));
gulp.task('copy-shortcut-configuration-mac', copy('./shortcut_configuration.json','./dist/nwjs.app/Contents/Resources/app.nw'));

gulp.task('copy-stylesheet', copy('./stylesheet.json','./dist/'));
gulp.task('copy-stylesheet-mac', copy('./stylesheet.json','./dist/nwjs.app/Contents/Resources/app.nw'));

function download_nwjs(platform){
	return function () {
		return Promise.all([
			new Promise(function(resolve,reject){
				// Check if the path exists. If it doesn't download NWJS
				pathExists('./nwjs-v0.31.5-'+platform).then(
					function(exists){
						if(!exists){
							var file = fs.createWriteStream("nwjs-v0.31.5-"+platform+".zip");
							// Download NWJS
							http.get("https://dl.nwjs.io/v0.31.5/nwjs-v0.31.5-"+platform+".zip", function(response) {
								// Pipe the download into a file
								var stream=response.pipe(file);
								stream.on('finish', function(){

									decompress("nwjs-v0.31.5-"+platform+".zip", '.').then(files => {
										fs.copySync("./nwjs-v0.31.5-"+platform, './dist/')
									});
								})
							})
							return true;
						}else{
							// The file is already downloaded and unzipped. Just need to copy it into dist
							// Copy the contents of the unzipped folder into ./dist
							fs.copySync("./nwjs-v0.31.5-"+platform, './dist/')
						}
					}
				)
			})
		])
	}
}

gulp.task('nwjs-linux-ia32', download_nwjs("linux-ia32"));
gulp.task('nwjs-linux-x64', download_nwjs("linux-x64"));
gulp.task('nwjs-osx-x64', download_nwjs("osx-x64"));
gulp.task('nwjs-win-ia32', download_nwjs("win-ia32"));
gulp.task('nwjs-win-x64', download_nwjs("win-x64"));

/*== dev ==*/
gulp.task('serve', ['clean', 'style', 'html', 'assets', 'copy-toolbar-configuration', 'copy-shortcut-configuration', 'copy-stylesheet'], getTask('./gulp/dev-script', Object.assign({
	entry: 'src/script',
	pkg: pkg
}, options)));

/*== production ==*/
gulp.task('build', ['clean', 'style', 'html', 'code', 'assets', 'copy-package-info', 'copy-toolbar-configuration', 'copy-shortcut-configuration', 'copy-stylesheet']);
gulp.task('build-win-ia32', ['clean', 'style', 'html', 'code', 'assets', 'copy-package-info', 'copy-toolbar-configuration', 'copy-shortcut-configuration', 'copy-stylesheet']);
gulp.task('build-win-x64', ['clean', 'style', 'html', 'code', 'assets', 'nwjs-win-x64', 'copy-package-info', 'copy-toolbar-configuration', 'copy-shortcut-configuration', 'copy-stylesheet']);

gulp.task('build-mac', ['clean', 'nwjs-osx-x64', 'style-mac', 'html-mac', 'code-mac', 'assets-mac', 'copy-package-info-mac', 'copy-toolbar-configuration-mac', 'copy-shortcut-configuration-mac', 'copy-stylesheet-mac']);

gulp.task('archive', ['build'], getTask('./gulp/prod-script', {
	expName: 'archive',
	pkg: pkg,
	dist: options.dist
}));
