'use strict';

const gulp        = require('gulp');
const minifyHtml  = require('gulp-minify-html');
const minifier    = require('gulp-uglify/minifier');
const strip       = require('gulp-strip-comments');
const jsonminify  = require('gulp-jsonminify');
const del         = require('del');
const uglifyjs    = require('uglify-js');
const pump        = require('pump');
const minifyCss   = require('gulp-minify-css');

/**
 * Name of production foler, who will contains production's sources
 * @type {String}
 */
const prodFolderName = 'prod';

/**
 * Delete the existing prod folder
 */
gulp.task('deleteExistingProdFolder', (cb) => {
  del(__dirname+'/'+prodFolderName).then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'));
    cb();
  });
});

/**
 * Minify JS files
 * The deleteExistingProdFolder task is require before this task.
 *
 * We get all JS file, except JS into node_modules and this file.
 * strip() will remove all comments.
 * minifier will minify JS files. We add into the second parameter uglifyjs, specifically
 * add from Harmony branch of UglifyJS project (see package.json).
 * Then, all minified JS files will be send into prod folder.
 */
gulp.task('js', ['deleteExistingProdFolder'], () => {
  return pump([
    gulp.src([__dirname+'/**/*.js', '!'+__dirname+'/node_modules/**/*.*', '!'+__dirname+'/gulpfile.js']),
    strip(),
    minifier(null, uglifyjs),
    gulp.dest(__dirname+'/'+prodFolderName)
  ]);
});

/**
 * Minify JSON files.
 * The deleteExistingProdFolder task is require before this task.
 */
gulp.task('json', ['deleteExistingProdFolder'], () => {
  return gulp.src([__dirname+'/**/*.json', '!'+__dirname+'/node_modules/**/*.*', '!'+__dirname+'/package.json'])
    .pipe(jsonminify())
    .pipe(gulp.dest(__dirname+'/'+prodFolderName));
});

/**
 * Minify HTML files.
 * The deleteExistingProdFolder task is require before this task.
 *
 * We does not use HTML files but EJS engine files.
 * This make not any problem :)
 */
gulp.task('html', ['deleteExistingProdFolder'], () => {
  return gulp.src(__dirname+'/views/**/*.ejs')
    .pipe(minifyHtml())
    .pipe(gulp.dest(__dirname+'/'+prodFolderName+'/views'));
});

/**
 * Move SSL certificats.
 * The deleteExistingProdFolder task is require before this task.
 */
gulp.task('moveCert', ['deleteExistingProdFolder'], () => {
  gulp
    .src(__dirname+'/config/cert/*.*')
    .pipe(gulp.dest(__dirname+'/'+prodFolderName+'/config/cert'));
});

/**
 * Minify public JS files.
 * The deleteExistingProdFolder task is require before this task.
 *
 * Very similary than previous JS task.
 */
gulp.task('public:js', ['deleteExistingProdFolder'], () => {
  return pump([
    gulp.src(__dirname+'/public/js/*.js'),
    strip(),
    minifier(null, uglifyjs),
    gulp.dest(__dirname+'/'+prodFolderName+'/public/js')
  ]);
});

/**
 * Minify CSS files.
 * The deleteExistingProdFolder task is require before this task.
 */
gulp.task('public:css', ['deleteExistingProdFolder'], () => {
  return gulp.src(__dirname+'/public/css/*.css')
    .pipe(minifyCss())
    .pipe(gulp.dest(__dirname+'/'+prodFolderName+'/public/css'));
});

/**
 * Default task.
 * Will run when `gulp` command will used without parameter.
 */
gulp.task('default', ['deleteExistingProdFolder', 'js', 'json', 'html', 'moveCert', 'public:js', 'public:css']);
