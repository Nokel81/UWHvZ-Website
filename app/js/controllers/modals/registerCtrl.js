function RegisterCtrl($scope, $uibModalInstance, AlertService) {
    "ngInject";

    const checkPasswords = function(password) {
        return password.length >= 8;
    };

    $scope.accept = function() {
        if (!$scope.email || !$scope.email.includes("@")) {
            return AlertService.danger("Email must be a valid email");
        }
        $scope.email = $scope.email.trim().toLowerCase();
        if ($scope.password !== $scope.passwordCheck) {
            return AlertService.danger("Passwords do not match");
        }
        if (!checkPasswords($scope.password, $scope.passwordCheck)) {
            return AlertService.danger("Password need to be more complex");
        }
        if (!$scope.name) {
            return AlertService.danger("Please type in your name");
        }
        const {email, password, name, team} = $scope;
        const {teamPreference} = team;
        const user = {email, password, name, teamPreference};
        $uibModalInstance.close(user);
    };

    $scope.decline = function() {
        $uibModalInstance.dismiss();
    };
}

module.exports = {
    name: "RegisterCtrl",
    fn: RegisterCtrl
};
