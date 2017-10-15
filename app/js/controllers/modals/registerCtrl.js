function RegisterCtrl($scope, $uibModalInstance, AlertService) {
    "ngInject";

    const checkPasswords = function(password) {
        if (password.length < 8) {
            return false;
        }
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        return hasUpperCase && hasLowerCase && hasNumbers;
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
        const {email, password, name, teamPreference} = $scope;
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
