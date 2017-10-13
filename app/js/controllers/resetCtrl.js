function ResetCtrl($scope, $location, AlertService, UserService) {
    "ngInject";

    if (!$location.search().code) {
        $location.url("/user");
    }

    const checkPasswords = function(password, passwordCheck) {
        if (password.length < 8 || password !== passwordCheck) {
            return false;
        }
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasNonalphas = /\W/.test(password);
        return hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas >= 3;
    };

    $scope.resetPassword = function() {
        if (!$scope.newPassword || !$scope.newPasswordCheck) {
            return AlertService.danger("Passwords have to be entered");
        }
        if (!checkPasswords($scope.newPassword, $scope.newPasswordCheck)) {
            return AlertService.danger("Passwords have to be complex enough and match");
        }
        UserService.resetPassword($scope.newPassword, $location.search().code, (err, res) => {
            if (err) {
                AlertService.danger(err);
            } else {
                AlertService.info(res);
                $location.url("/user");
            }
        });
    };
}

module.exports = {
    name: "ResetCtrl",
    fn: ResetCtrl
};
