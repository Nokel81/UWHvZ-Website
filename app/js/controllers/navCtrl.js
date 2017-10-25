function NavCtrl($scope, $rootScope, $location, UserService) {
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
        return x;
    });

    function setShowing(name, value) {
        let route = $scope.routes.find(x => x.showName === name);
        if (!route) {
            if (!$scope.showNames) {
                return;
            }
            route = $scope.routes.find(x => x.showNames.indexOf(name) >= 0);
            if (!route) {
                return;
            }
        }
        route.show = value;
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
}

module.exports = {
    name: "NavCtrl",
    fn: NavCtrl
};
