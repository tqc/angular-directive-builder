var fs = require("fs");
var vm = require('vm');

var util = require('util');

var traceur = require("traceur");


exports.build = function(options) {

    if (!fs.existsSync("dist")) fs.mkdirSync("dist");

    // find the entry point
    var src = fs.readFileSync("src/index.js", "utf8");
    var sourceFile = new traceur.syntax.SourceFile('inline-script', src);

    var parser = new traceur.syntax.Parser(sourceFile);
    var tree = parser.parseModule(true);


    var Compiler = traceur.Compiler;
    var c = new Compiler({});
    var output = c.compile(src);

    var sandbox = {
        System: {
            registerModule: function(x, y, fn) {
                sandbox.directiveOptions = fn().default;
            }
        }
    };

    vm.createContext(sandbox);

    vm.runInContext(output, sandbox);


    var directiveCode = "angular.module(\"" + options.moduleName + "\", " + JSON.stringify(options.dependencies || []) + ").directive(" + JSON.stringify(options.moduleName) + ", " + JSON.stringify(sandbox.directiveOptions.injections || []) + ".concat([" + sandbox.directiveOptions.fn.toString() + "]))";

    directiveCode = directiveCode.replace("require(\"./template.html\")", JSON.stringify(fs.readFileSync("src/template.html", "utf8")));

    fs.writeFileSync("dist/" + options.moduleName + ".js", directiveCode);

    var sassPath = process.platform === "win32" ? "sass.bat" : "sass";

    var params = (["--style", "nested"])
        .concat(["-I", ".", "--sourcemap=none", "--scss", "--stdin", "dist/" + options.moduleName + ".css"]);

    var spawn = require("child_process").spawn;
    var p = spawn(sassPath, params, {
        //                cwd: cwd
    });
    p.stdout.on('data', function(data) {
        console.log("" + data);
    });

    p.stderr.on('data', function(data) {
        console.log("" + data);
    });
    p.on("close", function(code) {
        console.log("Done sass build with code " + code);
    });

    var scss = fs.readFileSync(__dirname+ "/env.scss", "utf8");
    scss+="\n";
    scss+="@import \""+process.cwd()+"/src/index.scss\""
    p.stdin.write(scss);
    p.stdin.end();


};
