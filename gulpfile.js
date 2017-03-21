var gulp 			= require('gulp'),
	gulpif 			= require('gulp-if'),
	notify			= require('gulp-notify'),
	sass			= require('gulp-sass'),
	uglify			= require('gulp-uglify'),
	autoprefixer 	= require('gulp-autoprefixer'),
	rename 			= require('gulp-rename'),
	include 		= require('gulp-include'),
	livereload		= require('gulp-livereload'),
	babel					= require('gulp-babel');
	// watch 			= require('gulp-watch');


// Set up the live reload watcher
var livereloadTask = function() {
	var run = function() {
		livereload.listen();
	}

	run();
}

// Live Reload html and php files on change
var pageTask = function() {

	// Watch for changes on php files
	gulp.watch(['*/**/*.php', '*/.php', '*.php', '*.html']).on('change', function(file) {
		livereload.changed(file.path);
	});
}

// Compile JS Functions and Project.js to project.min.js
var jsTask = function(options) {
	if(options.development) {
		var run = function() {
			var start = new Date();
			console.log('Building JS Bundle');
			gulp.src(options.src)
				.pipe(include({
					extensions: "js",
					includePaths: [
						__dirname + "/assets/src/js"
					]
				}))
				.pipe(rename('project.min.js'))
				.pipe(gulp.dest(options.dest))
				.pipe(livereload())
				.pipe(notify(function() {
					console.log('JS bundle built in ' + (Date.now() - start) + 'ms');
				}));
		};

		// Run initial build
		run();

		// Watch for changes on src and livereload
		gulp.watch(options.src, run);

	} else {
		gulp.src(options.src)
			.pipe(include())
			.pipe(uglify())
			.pipe(rename('project.min.js'))
			.pipe(gulp.dest(options.dest))
			.pipe(notify(function() {
				console.log('| src/js/project.js >> dist/js/project.min.js');
			}));
	};
}


// Compile JS Plugin files to the vendor.js file
var vendorTask = function(options) {
	if(options.development) {
		var run = function() {
			var start = new Date();
			console.log('Building JS Vendor Bundle');
			gulp.src(options.src)
				.pipe(include())
				.pipe(rename('vendor.min.js'))
				.pipe(gulp.dest(options.dest))
				.pipe(livereload())
				.pipe(notify(function() {
					console.log('JS Vendor bundle built in ' + (Date.now() - start) + 'ms');
				}));
		};

		// Run initial build
		run();

		// Watch for changes on src and livereload
		gulp.watch(options.src, run);

	} else {
		gulp.src(options.src)
			.pipe(include())
			.pipe(uglify())
			.pipe(rename('vendor.min.js'))
			.pipe(gulp.dest(options.dest))
			.pipe(notify(function() {
				console.log('| src/js/vendor.js >> dist/js/vendor.min.js');
			}));
	};
}

// Compile Scss Files to either the build
// or the dist directories
var sassTask = function(options) {
	if(options.development) {

		var run = function() {
			var start = new Date();
			console.log('Building Sass Bundle');
			gulp.src(options.src)
				.pipe(sass().on('error', sass.logError))
				.pipe(autoprefixer({
					browsers: ['last 2 versions'],
					cascade: false
				}))
				.pipe(rename('compiled.css'))
				.pipe(gulp.dest(options.dest))
				.pipe(livereload())
				.pipe(notify(function () {
					console.log('Sass bundle built in ' + (Date.now() - start) + 'ms');
				}));
		};

		// Run initial build
		run();

		// Watch for changes on src and livereload
		gulp.watch(options.src, run);

	} else {
		gulp.src(options.src)
			.pipe(sass({outputStyle: 'compressed'}))
			.pipe(autoprefixer({
				browsers: ['last 2 versions'],
				cascade: false
			}))
			.pipe(rename('compiled.css'))
			.pipe(gulp.dest(options.dest))
			.pipe(notify(function () {
				console.log('| src/sass/project.scss >> dist/css/compiled.css')
			}));
	}
}


gulp.task('default', function() {
	console.log('Hello World');
});

// Development Tasks
gulp.task('build', function() {

	livereloadTask();

	pageTask();

	jsTask({
		development: true,
		src: './assets/src/js/project.js',
		dest: './assets/build/js'
	});

	vendorTask({
		development: true,
		src: './assets/src/js/vendor.js',
		dest: './assets/build/js'
	});

	sassTask({
		development: true,
		src: './assets/src/sass/**/*.scss',
		dest: './assets/build/css'
	});
});

// Deployment Tasks
gulp.task('deploy', function() {

	jsTask({
		development: false,
		src: './assets/src/js/project.js',
		dest: './assets/dist/js'
	});

	vendorTask({
		development: false,
		src: './assets/src/js/vendor.js',
		dest: './assets/dist/js'
	});

	sassTask({
		development: false,
		src: './assets/src/sass/**/*.scss',
		dest: './assets/dist/css'
	});
});
