const gulp = require('gulp'),
      sass = require('gulp-sass'),
      sourcemaps          = require('gulp-sourcemaps'),
      autoprefixer        = require('gulp-autoprefixer'),
      imagemin            = require('gulp-imagemin'),
      useref              = require('gulp-useref'),
      gulpif              = require('gulp-if'),
      uglify              = require('gulp-uglify'),
      babel               = require('gulp-babel'),
      uncss               = require('gulp-uncss'),
      browserSync         = require('browser-sync').create();


      // Compile SCSS to CSS
      gulp.task('styles', function(){
            return gulp.src('src/sass/**/*.scss')
                  .pipe(sourcemaps.init())
                  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
                  .pipe(autoprefixer({
                        browsers: ['last 2 versions']
                  }))
                  .pipe(sourcemaps.write('./maps'))
                  .pipe(gulp.dest('dist/css'))
                  .pipe(browserSync.stream());
      });

      // uncss task
      gulp.task('uncss', function(){
            return gulp.src('src/sass/**/*.scss')
                  .pipe(sourcemaps.init())
                  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
                  .pipe(uncss({
                        html: ['dist/index.html', 'dist/pages/**/*.html']
                  }))
                  .pipe(autoprefixer({
                        browsers: ['last 2 versions']
                  }))
                  .pipe(sourcemaps.write('./maps'))
                  .pipe(gulp.dest('dist/css'))
                  .pipe(browserSync.stream());
      });

      // Copy files to dist/
      gulp.task('copy', function() {
            return gulp.src('src/**/*.html')
                  .pipe(useref())
                  .pipe(gulpif('*.js',sourcemaps.init()))
                  .pipe(gulpif('*.js',babel({presets: ['env']})))
                  .pipe(gulpif('*.js', uglify()))
                  .pipe(gulpif('*.js',sourcemaps.write('.')))
                  .pipe(gulp.dest('dist'))
                  .pipe(browserSync.stream());
      })

      // Images optimization
      gulp.task('images', function(){
            return gulp.src('src/images/*')
                  .pipe(imagemin())
                  .pipe(gulp.dest('dist/images'));
      })

      // Browser Sync
      gulp.task('browserSync', function(){
            browserSync.init({
                  server: {
                        baseDir: 'dist'
                  }
            })
      })


      // Watch task
      // gulp.task('watch',['browserSync', 'styles'], function(){
      //       gulp.watch('src/sass/**/*.scss', ['styles']);
      //       gulp.watch('src/**/*.+(html|js)', ['copy']);
      //       gulp.watch('src/images/*', ['images']);
      // })

      gulp.task('watch', function(){
            gulp.watch('src/sass/**/*.scss', ['styles', 'uncss']);
            gulp.watch('src/**/*.+(html|js)', ['copy']);
            gulp.watch('src/images/*', ['images']);
      })
      
      // Default task
      gulp.task('default', ['styles', 'copy', 'images', 'browserSync', 'uncss','watch']);

      