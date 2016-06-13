import path from 'path';
import del from 'del';
import gulp from 'gulp';
import babel from 'gulp-babel';
import coveralls from 'gulp-coveralls';
import eslint from 'gulp-eslint';
import excludeGitignore from 'gulp-exclude-gitignore';
import istanbul from 'gulp-istanbul';
import mocha from 'gulp-mocha';
import nsp from 'gulp-nsp';
import plumber from 'gulp-plumber';
import { Instrumenter } from 'isparta';
import runSeq from 'run-sequence';

gulp.task('static', () => {
  return gulp.src('src/**/*.js')
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('nsp', (cb) => {
  nsp({ package: path.resolve('package.json') }, cb);
});

gulp.task('clean-test', () => del('coverage'));

gulp.task('pre-test', ['clean-test'], () => {
  return gulp.src('src/generators/**/*.js')
    .pipe(excludeGitignore())
    .pipe(istanbul({
      instrumenter: Instrumenter,
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], (cb) => {
  var mochaErr;
  
  gulp.src('test/**/*.js')
    .pipe(plumber())
    .pipe(mocha({
      reporter: 'spec'
    }))
    .on('error', (err) => mochaErr = err)
    .pipe(istanbul.writeReports())
    .on('end', () => cb(mochaErr));
});

gulp.task('watch', () => {
  gulp.watch(['src/generators/**/*.js', 'test/**'], ['test']);
});

gulp.task('coveralls', ['test'], () => {
  if (!process.env.CI) {
    return;
  }
  
  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe(coveralls());
});

gulp.task('clean', () => del('lib'));

gulp.task('build', ['clean', 'static'], () => gulp.src('src/**/*.js').pipe(babel()).pipe(gulp.dest('lib')));

// gulp.task('prepublish', ['nsp']);
// gulp.task('default', ['build', 'test', 'coveralls']);

var buildArr = ['build', 'coveralls'];
gulp.task('prepublish', (cb) => {
  runSeq(...buildArr, 'nsp', cb);
});

gulp.task('default', (cb) => {
  runSeq(...buildArr, cb);
});