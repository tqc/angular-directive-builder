# Angular Directive Builder

[ ![Codeship Status for tqc/angular-directive-builder](https://codeship.com/projects/79fc41e0-1b30-0133-90d0-7e346f2e432c/status?branch=master)](https://codeship.com/projects/94441)

Tools for building angular directives as es6 modules

## Install

    npm install angular-directive-builder

## Usage

Directives are defined using the below format rather than the standard module.directive call.

    export default {
        name: "slider",
        injections: ["$parse"],
        fn: function($parse) {
            return {
                template: require("./template.html"),
                replace: true,
                scope: true,
                link: function(scope, element, attrs) {
                    ...
                }
            }
        }

This allows the directive to be added to a browserify based app using 
    
            this.registerOptionalDirective(require("slider"));

See https://github.com/tqc/ChondricJS/blob/master/es6/core.js for details.

For use in standalone angular apps, the source file is compiled into a regular ES5 angular module.

See https://github.com/tqc/tc-slider for an example.


