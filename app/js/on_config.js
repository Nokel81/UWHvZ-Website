function OnConfig($stateProvider, $locationProvider, $urlRouterProvider) {
    "ngInject";

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $stateProvider
        .state("Home", {
            url: "/",
            views: {
                main: {
                    controller: "HomeCtrl",
                    templateUrl: "../views/home.html",
                    title: "Home"
                },
                user: {
                    controller: "UserCtrl",
                    templateUrl: "../views/user.html",
                    title: "User"
                }
            }
        })
        .state("Rules", {
            url: "/rules",
            views: {
                main: {
                    controller: "RulesCtrl as rules",
                    templateUrl: "../views/rules.html",
                    title: "Rules"
                },
                user: {
                    controller: "UserCtrl as user",
                    templateUrl: "../views/user.html",
                    title: "User"
                }
            }
        })
        .state("Game Info", {
            url: "/game",
            views: {
                main: {
                    controller: "InfoCtrl as info",
                    templateUrl: "../views/gameinfo.html",
                    title: "Game Info"
                },
                user: {
                    controller: "UserCtrl as user",
                    templateUrl: "../views/user.html",
                    title: "User"
                }
            }
        })
        .state("Map", {
            url: "/map",
            views: {
                main: {
                    controller: "MapCtrl as map",
                    templateUrl: "../views/map.html",
                    title: "Maps"
                },
                user: {
                    controller: "UserCtrl as user",
                    templateUrl: "../views/user.html",
                    title: "User"
                }
            }
        });

    $urlRouterProvider.otherwise("/");
}

module.exports = OnConfig;
