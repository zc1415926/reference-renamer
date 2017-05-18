/**
 * Created by zc1415926 on 2017/5/17.
 *
 */
let Q = require('q');
let asar = require('asar');
let gulpUtil = require('gulp-util');
let jetpack = require('fs-jetpack');

let releaseDir;
let projectDir;
let manifest;
let appDir;

function init() {
    projectDir = jetpack;
    releaseDir = projectDir.dir('./release', {empty: true});
    appDir = projectDir.dir('./build');
    manifest = appDir.read('./package.json', 'json');
    return Q();
}

function copyElectron() {
    gulpUtil.log(releaseDir.path());
    return projectDir.copyAsync('./node_modules/electron/dist', releaseDir.path(), {overwrite: true});
}

function cleanupRuntime() {
    return releaseDir.removeAsync('resources/default_app.asar');
}

function createAsar() {
    var deferred = Q.defer();
    asar.createPackage(appDir.path(), releaseDir.path('resources/app.asar'), function () {
        deferred.resolve();
    });
    return deferred.promise;
}
function updateResources() {
    var deferred = Q.defer();

    // Copy your icon from resource folder into build folder.
    projectDir.copy('resources/zc.ico', releaseDir.path('icon.ico'));

    // Replace Electron icon for your own.
    let rcedit = require('rcedit');
    rcedit(releaseDir.path('electron.exe'), {
        'icon': releaseDir.path('icon.ico'),
        'version-string': {
            'ProductName': manifest.releaseName,
            'FileDescription': manifest.description,
        }
    }, function (err) {
        if (!err) {
            deferred.resolve();
        }
    });
    return deferred.promise;
}
//Rename the electron exe
function rename() {
    return releaseDir.renameAsync('electron.exe', manifest.releaseName + '.exe');
}

function build() {
    return init()
        .then(copyElectron)
        .then(cleanupRuntime)
        .then(createAsar)
        .then(updateResources)
        .then(rename);
}

module.exports = {
    build: build
};