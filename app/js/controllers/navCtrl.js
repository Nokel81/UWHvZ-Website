function NavCtrl($scope, $rootScope, $location, UserService) {
    "ngInject";
    UserService.getBySession(() => {
        UserService.getUserType(type => {
            $rootScope.isModerator = type === "Moderator";
        });
    });

    $scope.$watch(function () {
        return $location.path();
    }, newVal => {
        console.log(newVal);
        if (newVal) {
            UserService.getUserType(type => {
                $rootScope.isModerator = type === "Moderator";
            });
        }
    });
}

module.exports = {
    name: "NavCtrl",
    fn: NavCtrl
};
