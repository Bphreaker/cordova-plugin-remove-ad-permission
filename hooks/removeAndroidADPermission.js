// Global vars
var deferral, fs, elementtree, path;

var removeADPermission = (function () {

    var removeADPermission = {};

    var manifestPaths = {
        cordovaAndroid6: "platforms/android/AndroidManifest.xml",
        cordovaAndroid7: "platforms/android/app/src/main/AndroidManifest.xml"
    };

    var rootDir;

    removeADPermission.fileExists = function (filePath) {
        try {
            return fs.statSync(filePath).isFile();
        } catch (error) {
            return false;
        }
    };

    removeADPermission.parseElementtreeSync = function (filename) {
        var content = fs.readFileSync(filename, 'utf-8');
        return new elementtree.ElementTree(elementtree.XML(content));
    };

    removeADPermission.getAndroidManifestPath = function () {
        var cordovaAndroid6Path = path.join(rootDir, manifestPaths.cordovaAndroid6);
        var cordovaAndroid7Path = path.join(rootDir, manifestPaths.cordovaAndroid7);

        if (this.fileExists(cordovaAndroid6Path)) {
            return cordovaAndroid6Path;
        } else if (this.fileExists(cordovaAndroid7Path)) {
            return cordovaAndroid7Path;
        } else {
            return undefined;
        }
    };


    removeADPermission.apply = function (ctx) {
        debugger;
        rootDir = ctx.opts.projectRoot;

        var androidManifestPath = this.getAndroidManifestPath();
        if(!androidManifestPath) {
            throw new Error("Unable to find AndroidManifest.xml");
        }
        
        var manifestTree = this.parseElementtreeSync(androidManifestPath);
        var root = manifestTree.getroot();

        if (root) {
            var applicationElement = root.find("./application");
            if (applicationElement) {
                root.set("xmlns:tools", "http://schemas.android.com/tools");
                
                applicationElement.set("tools:remove", "<uses-permission android:name='com.google.android.gms.permission.AD_ID' />");
            } else {
                throw new Error("Invalid AndroidManifest.xml structure. No <application> tag found.");
            }

            fs.writeFileSync(androidManifestPath, manifestTree.write({indent:4}, 'utf-8'));
        } else {
            throw new Error("Invalid AndroidManifest.xml structure. No <manifest> tag found.");
        }
    };

    return removeADPermission;
})();

module.exports = function (ctx) {
    var Q = ctx.requireCordovaModule("q");
    fs = ctx.requireCordovaModule("fs");
    path = ctx.requireCordovaModule("path");
    elementtree = ctx.requireCordovaModule("elementtree");

    deferral = Q.defer();

    try {
        removeADPermission.apply(ctx);
        deferral.resolve();
    } catch (error) {
        deferral.reject(error);
        return deferral.promise;
    }

    return deferral.promise;
};
