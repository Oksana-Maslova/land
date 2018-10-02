const
  gulp = require('gulp'),
  bower = require('main-bower-files'),
  sass = require('gulp-sass'),
  jade = require('gulp-jade'),
  concat = require('gulp-concat'),
  replace = require('gulp-replace'),
  livereload = require('gulp-livereload'),
  version = require('./package.json').version || '0.0.0';

const config = {
  source: './sources',
  fonts: './sources/fonts',
  images: './sources/images',
  build: './build'
};

gulp.task('default', ['styles', 'template', 'static'], () => {

  gulp.watch(`${config.source}/*.jade`, ['template']);
  gulp.watch(`${config.source}/*.scss`, ['styles']);
  gulp.watch(`${config.source}/images/**`, ['static']);
  gulp.watch(`${config.source}/fonts/**`, ['static']);

  if(process.env.NODE_ENV == 'local'){
    livereload.listen();
    gulp.watch([config.build + '/**'])
      .on('change', livereload.changed);
  }

});

/**
 * Compile *.scss files to css and copy to build folder
 */
gulp.task('styles', () => {
  return gulp.src(
    bower({filter: /\.css$/i})
      .concat(`${config.source}/*.scss`)
  )
    .pipe(sass())
    .pipe(concat('styles.scss'))
    .pipe(sass({style: 'nested'}))
    .pipe(gulp.dest(config.build))
});

gulp.task('template', () => {
    return gulp.src(`${config.source}/*.html`)
        .pipe(replace(/#version/g, version))
        // .pipe(jade({pretty: true}))
        .pipe(gulp.dest(config.build));
});


/**
 * Copy static file (i.e. `fonts`, `images`, `robots.txt`) from source folder to build folder
 */
gulp.task('static', () => {
  return gulp.src(
      [
        `${config.images}/**`,
        `${config.fonts}`,
        `${config.source}/robots.txt`],
      {base: 'sources'}
    )
    .pipe(gulp.dest(config.build));
});