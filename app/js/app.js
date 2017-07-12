const angular = require("angular");

// Angular modules
const constants = require("./constants");
const onConfig = require("./on_config");
const onRun = require("./on_run");
require("@uirouter/angularjs");
require("angular-cookies");
require("angular-bootstrap-colorpicker");
require("angular-aria");
require("angular-ui-bootstrap");
require("angular-animate");
require("./controllers");
require("./directives");
require("./services");

// Mount on window for testing
window.app = angular.module("app", [
    "ui.bootstrap",
    "ui.router",
    "ngAnimate",
    'colorpicker.module',
    "ngCookies",
    "app.controllers",
    "app.directives",
    "app.services"
]);

angular.module("app").constant("AppSettings", constants);

angular.module("app").config(onConfig);

angular.module("app").run(onRun);
