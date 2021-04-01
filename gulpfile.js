const { src, dest, watch, series, parallel } = require("gulp");
const pipeline = require("readable-stream").pipeline;
const fileInclude = require("gulp-file-include");
const sourcemaps = require("gulp-sourcemaps");
const prefix = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const babel = require("gulp-babel");
const jsmin = require("gulp-uglify");
const newer = require("gulp-newer");
const imgMin = require("gulp-imagemin");
const browserSync = require("browser-sync").create();

const html = function () {
    return pipeline(
        src("src/**/*.html"),
        fileInclude({ prefix: "@@" }),
        dest("dist/"),
        browserSync.stream()
    );
}

const styles = function () {
    return pipeline(
        src("src/css/*.css"),
        sourcemaps.init(),
        prefix(),
        csso(),
        sourcemaps.write("."),
        dest("dist/css"),
        browserSync.stream()
    );
}

const scripts = function () {
    return pipeline(
        src("src/js/*.js"),
        sourcemaps.init(),
        babel({
            presets: ['@babel/env']
        }),
        jsmin(),
        sourcemaps.write("."),
        dest("dist/js"),
        browserSync.stream()
    );
}

const img = function () {
    return pipeline(
        src("src/images/*"),
        newer("dist/images"),
        imgMin(),
        dest("dist/images/")
    );
}

const server = function (cb) {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        notify: false,
        open: true,
    });
    cb();
}

const observe = function (cb) {
    watch("src/**/*.html", { usePolling: true }, html);
    watch("src/css/*.css", { usePolling: true }, styles);
    watch("src/js/*.js", { usePolling: true }, scripts);
    cb();
}

exports.default = series(html, styles, scripts, img);
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.img = img;
exports.watch = parallel(server, observe);