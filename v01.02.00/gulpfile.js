var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var less = require('gulp-less');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var clean = require('gulp-clean');
var zip = require('gulp-zip');
var watch = require('gulp-watch');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var del = require('del');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var browserify = require('browserify');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var envify = require('envify');
var path = require('path');
var browserSync = require('browser-sync').create();
var httpProxy = require('http-proxy');
var compression = require('compression');
var config = require('./coral.conf');

var proxy = httpProxy.createProxyServer({
  target: config.proxy
});

proxy.on('error', function(e) {
  
});

var production = false;

var dependencies = [
  'alt',
  'react',
  'react-dom',
  'react-router',
  'react-modal'
];

/*
 |--------------------------------------------------------------------------
 | Combine all JS libraries into a single file for fewer HTTP requests.
 |--------------------------------------------------------------------------
 */
gulp.task('vendor', function() {
  return gulp.src([
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/waypoints/lib/jquery.waypoints.min.js',
    'bower_components/jquery.cookie/jquery.cookie.js',
    'bower_components/jquery.lazyload/jquery.lazyload.js',
    'bower_components/swiper/dist/js/swiper.jquery.min.js',
    'www/scripts/jquery-qrcode-0.14.0.min.js',
    'bower_components/arg.js/dist/arg-1.3.min.js',
    //'bower_components/socket.io-client/socket.io.js',
    'bower_components/toastr/toastr.min.js',
    'bower_components/underscore/underscore-min.js',
    'bower_components/async/dist/async.min.js'
  ]).pipe(concat('vendor.js'))
    .pipe(gulpif(production, uglify()))
    .pipe(gulp.dest('build/js'));
});

/*
 |--------------------------------------------------------------------------
 | Compile third-party dependencies separately for faster performance.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify-vendor', function() {
  return browserify()
    .require(dependencies)
    .bundle()
    .pipe(source('vendor.bundle.js'))
    .pipe(buffer())
    .pipe(gulpif(production, uglify()))
    .pipe(gulp.dest('build/js'));
});

/*
 |--------------------------------------------------------------------------
 | Compile only project files, excluding all third-party dependencies.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify', ['browserify-vendor'], function() {
  return browserify({ entries: 'app/main.js', debug: false })
    .external(dependencies)
    .transform(babelify, { presets: ['es2015', 'react'] })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulpif(production, uglify()))
    .pipe(gulp.dest('build/js'));
});

/*
 |--------------------------------------------------------------------------
 | Same as browserify task, but will also watch for changes and re-compile.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify-watch', ['browserify-vendor'], function() {
  var bundler = watchify(browserify({ entries: 'app/main.js', debug: true }, watchify.args));
  bundler.external(dependencies);
  bundler.transform(babelify, { presets: ['es2015', 'react'] });
  bundler.on('update', rebundle);
  return rebundle();

  function rebundle() {
    var start = Date.now();
    return bundler.bundle()
      .on('error', function(err) {
        gutil.log(gutil.colors.red(err.toString()));
      })
      .on('end', function() {
        gutil.log(gutil.colors.green('Finished rebundling in', (Date.now() - start) + 'ms.'));
      })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('build/js/'));
  }
});

/*
 |--------------------------------------------------------------------------
 | Compile LESS stylesheets.
 |--------------------------------------------------------------------------
 */
gulp.task('styles', function() {
  return gulp.src('www/stylesheets/main.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(gulpif(production, cssmin()))
    .pipe(gulp.dest('build/css'));
});

/*
 |--------------------------------------------------------------------------
 | Compile pdf.js javascript.
 |--------------------------------------------------------------------------
 */
gulp.task('pdf-www', function () {
  return gulp.src(['www/pdf/**', '!www/pdf/**/*.js'])
    .pipe(gulp.dest('build/pdf'));
});

gulp.task('pdf-js', function () {
  return gulp.src('www/pdf/**/*.js')
    .pipe(gulpif(production, uglify()))
    .pipe(gulp.dest('build/pdf'));
});

gulp.task('pdf-module', function(done) {
  runSequence('pdf-www',
              'pdf-js',
              done);
});

gulp.task('watch', function() {
  watch('www/scripts/**/*.js', function() {
    gulp.start('scripts');
  });
  watch('www/stylesheets/**/*.less', function() {
    gulp.start('styles');
  });
  watch('www/views/**/*.html', function() {
    gulp.start('views');
  });
  watch('www/assets/**', function() {
    gulp.start('assets');
  });
});

gulp.task('scripts', function() {
  return gulp.src('www/scripts/**/*.js')
    .pipe(gulpif(production, uglify()))
    .pipe(gulp.dest('build/scripts'));
});

gulp.task('assets', function() {
  return gulp.src(['www/assets/**', 'www/.htaccess', 'www/favicon.ico'])
    .pipe(gulp.dest('build'));
});

gulp.task('views', function() {
  var date = new Date().getTime();
  return gulp.src('www/views/**/*.html')
    .pipe(replace(/_TIMESTAMP_/g, date))
    .pipe(gulpif(production, replace(/_BASE_/, '/insurance/'), replace(/_BASE_/, '/')))
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function() {
  return del.sync(['build']);
});

gulp.task('prd', function() {
  process.env.NODE_ENV = 'production';
  production = true;
});

gulp.task('zip', function() {
  return gulp.src(['build/**', 'build/.htaccess'])
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('dist'));
});

gulp.task('browser-sync', function() {
  browserSync.init({
    files: ['build/**'],
    server: {
      baseDir: 'build',
      middleware: [
        compression(),
        function (req, res, next) {
          if (req.url.match(new RegExp(config.path[0]))) {
            proxy.web(req, res);
          } else if (req.url.match(new RegExp(config.path[1]))) {
            proxy.web(req, res);
          } else {
            next();
          }
        },
        function (req, res, next) {
          var reg = new RegExp(config.name);
          if (req.url.match(reg)) {
            req.url = '/index.html';
            //res.writeHead(302, {'Location': req.url});
            //res.end();
          }
          next();
        }
      ]
    }
  });
});



gulp.task('default', ['clean'], function(done) {
  runSequence(['pdf-module', 'scripts', 'views', 'assets', 'styles', 'vendor', 'browserify-watch', 'watch'],
              'browser-sync',
              done);
});

gulp.task('build', function(done) {
  runSequence('clean',
              ['pdf-module', 'scripts', 'views', 'assets', 'styles', 'vendor', 'browserify'],
              done);
});

gulp.task('dist', function(done) {
  runSequence('prd',
              'build',
              'zip',
              done);
});