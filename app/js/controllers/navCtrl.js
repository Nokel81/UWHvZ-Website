function NavCtrl($scope, $rootScope, $location, UserService, $window) {
    "ngInject";

    $scope.routes = [{
        route: "/rules",
        text: "Rules"
    }, {
        route: "/map",
        text: "Map"
    }, {
        route: "/game",
        text: "Game Information"
    }, {
        route: "/moderators",
        text: "Moderator Controls",
        showNames: ["isModerator", "isSuper"]
    }, {
        route: "/super",
        text: "Super User Panel",
        showName: "isSuper"
    }, {
        route: "/user",
        text: "User"
    }, {
        route: "/trees",
        text: "Zombie Trees"
    }, {
        route: "/invitational",
        text: "Invitational"
    }].map(x => {
        x.show = true;
        if (x.showNames) {
            x.showing = {};
        }
        return x;
    });

    function setShowing(name, value) {
        for (let i in $scope.routes) {
            let route = $scope.routes[i];
            if (route.showName === name) {
                route.show = value;
            } else if ((route.showNames || []).indexOf(name) >= 0) {
                route.showing[name] = value;
                route.show = Object.keys(route.showing).reduce((sum, val) => sum || route.showing[val], false);
            }
        }
    }

    UserService.getBySession(user => {
        if (!user) {
            $rootScope.loggedIn = false;
            return;
        }
        $rootScope.loggedIn = true;
        UserService.getUserType(type => {
            $rootScope.isModerator = type === "Moderator";
        });
        UserService.isSuper(isSuper => {
            $rootScope.isSuper = isSuper;
        });
    });

    $scope.$watch(() => {
        return $location.path();
    }, newVal => {
        if (newVal) {
            UserService.getBySession(() => {
                UserService.getUserType(type => {
                    $rootScope.isModerator = type === "Moderator";
                });
                UserService.isSuper(isSuper => {
                    $rootScope.isSuper = isSuper;
                });
            });
        }
    });

    $scope.$watch("newRoute", newVal => {
        if (!newVal) {
            return;
        }
        $location.path(newVal);
    });

    $scope.$watch(() => {
        return $rootScope.isModerator;
    }, newVal => {
        setShowing("isModerator", newVal);
    });

    $scope.$watch(() => {
        return $rootScope.isSuper;
    }, newVal => {
        setShowing("isSuper", newVal);
    });

    $scope.logout = function () {
        if (!$window.confirm("Are you sure you want to log out?")) {
            return;
        }
        UserService.logout(() => {
            $rootScope.isModerator = false;
            $rootScope.loggedIn = false;
            $location.path("/");
        });
    };
}

module.exports = {
    name: "NavCtrl",
    fn: NavCtrl
};
