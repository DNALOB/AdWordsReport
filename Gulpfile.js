var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('build', function() {
	gulp.src('AdWordsReport.js')
		.pipe(uglify({
            'preserveComments': 'license'
        }))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('dist'));
});
