function NavCtrl($scope, $rootScope, $location, UserService) {
    "ngInject";
    UserService.getBySession((user) => {
        if (!user) {
            return;
        }
        UserService.getUserType(type => {
            $rootScope.isModerator = type === "Moderator";
        });
        UserService.isSuper(isSuper => {
            $rootScope.isSuper = isSuper;
        });
    });

    $scope.$watch(function () {
        return $location.path();
    }, newVal => {
        if (newVal) {
            UserService.getBySession((user) => {
                UserService.getUserType(type => {
                    $rootScope.isModerator = type === "Moderator";
                });
                UserService.isSuper(isSuper => {
                    $rootScope.isSuper = isSuper;
                });
            });
        }
    });
}

module.exports = {
    name: "NavCtrl",
    fn: NavCtrl
};
