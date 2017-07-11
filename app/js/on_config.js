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
                    templateUrl: "../views/info.html",
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
        .state("Moderator", {
            url: "/moderators",
            views: {
                main: {
                    controller: "ModCtrl as mod",
                    templateUrl: "../views/mod.html",
                    title: "Moderators"
                }
            }
        })
        .state("Reset", {
            url: "/passwordReset",
            views: {
                main: {
                    controller: "ResetCtrl as reset",
                    templateUrl: "../views/reset.html",
                    title: "Password Reset"
                }
            }
        })
        .state("ZombieTree", {
            url: "/trees",
            views: {
                main: {
                    controller: "TreeCtrl as tree",
                    templateUrl: "../views/tree.html",
                    title: "Zombie Family Trees"
                }
            }
        })
        .state("Super", {
            url: "/super",
            views: {
                main: {
                    controller: "SuperCtrl as super",
                    templateUrl: "../views/super.html",
                    title: "Super User Panel"
                }
            }
        });

    $urlRouterProvider.otherwise("/");
}

module.exports = OnConfig;
