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
                }
            }
        })
        .state("User", {
            url: "/user",
            views: {
                main: {
                    controller: "UserCtrl as user",
                    templateUrl: "../views/user.html",
                    title: "User"
                }
            }
        })

    $urlRouterProvider.otherwise("/");
}

module.exports = OnConfig;
