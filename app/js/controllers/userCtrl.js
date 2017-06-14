function UserCtrl($scope, UserService) {
    "ngInject";

    $scope.button_state = "logIn";
    $scope.email = UserService.email;
    $scope.password = UserService.password;

    $scope.$watch("email", newVal => {
        UserService.email = newVal;
    });

    $scope.$watch("password", newVal => {
        UserService.password = newVal;
    });

    $scope.logIn = function () {
        if ($scope.button_state !== "logIn") {
            $scope.button_state = "logIn";
            return;
        }
        
    };

    $scope.signUp = function () {
        if ($scope.button_state !== "signUp") {
            $scope.button_state = "signUp";
            return;
        }
    };
}

module.exports = {
    name: "UserCtrl",
    fn: UserCtrl
};
