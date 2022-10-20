const gulp = require("gulp"),
    clean = require("gulp-clean"),
    imagemin = require("gulp-imagemin"),
    csso = require("gulp-csso"),
    htmlmin = require("gulp-htmlmin"),
    uglify = require("gulp-uglify"),
    browserify = require("gulp-browserify"),
    plumber = require("gulp-plumber"),
    babel = require("gulp-babel");

var source = {
    src: "./src/",
    html: "./*.html",
    css: "./src/css/*",
    js: "./src/js/**/*",
    mainJS: "./src/js/main.js",
    img: "./src/assets/**/*",
};

var build = {
    src: "./build/*",
    html: "./build/",
    css: "./build/src/css/",
    js: "./build/src/js/",
    img: "./build/src/assets/",
};

// task for html
gulp.task("html", async function () {
    gulp.src(source.html)
        .pipe(plumber())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(build.html));
});

// task for css
gulp.task("css", async function () {
    gulp.src(source.css)
        .pipe(plumber())
        .pipe(csso())
        .pipe(gulp.dest(build.css));
});

// task for js
gulp.task("js", async function () {
    gulp.src(source.mainJS)
        .pipe(plumber())

        .pipe(
            browserify({
                insertGlobals: true,
                debug: true,
            })
        )
        // .pipe(
        //     babel({
        //         presets: ["@babel/preset-env"],
        //     })
        // )
        //.pipe(uglify())
        .pipe(gulp.dest(build.js));
});

// task for images
gulp.task("img", async function () {
    gulp.src(source.img)
        .pipe(plumber())
        .pipe(imagemin())
        .pipe(gulp.dest(build.img));
});

//task for clean
gulp.task("clean", async function () {
    gulp.src(build.src).pipe(clean());
});

// task for build
gulp.task("build", gulp.series("html", "css", "js", "img"));

// watch
gulp.task("watch", async function () {
    gulp.watch(source.css, gulp.series("css"));
    gulp.watch(source.html, gulp.series("html"));
    gulp.watch(source.js, gulp.series("js"));
    gulp.watch(source.img, gulp.series("img"));
});
