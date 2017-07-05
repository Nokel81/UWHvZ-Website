function UserCtrl($scope, UserService, $cookies, AlertService, $location, $rootScope, ModalService) {
    "ngInject";
    const emailRegex = /^(([^<>()[]\\.,;:\s@"]+(\.[^<>()[]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    $scope.buttonState = "logIn";
    $scope.email = UserService.email;
    $scope.password = UserService.password;
    $scope.session = UserService.session;

    const checkPasswords = function (password, passwordCheck) {
        if (password.length < 8 || password !== passwordCheck) {
            return false;
        }
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasNonalphas = /\W/.test(password);
        return hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas >= 3;
    };

    UserService.getBySession(user => {
        $scope.user = user;
        UserService.getUserSettings(settings => {
            $scope.settings = settings || {};
        });
    });

    if ($location.search().token) {
        const token = $location.search().token;
        $cookies.remove("session");
        $scope.session = null;
        UserService.session = null;
        UserService.user = null;
        $location.search("token", null);// Removes the search parameter
        UserService.confirmEmail(token, (err, res) => {
            if (err) {
                AlertService.danger(err);
            } else {
                AlertService.info(res);
            }
        });
    }

    $scope.$watch("settings", newVal => {
        if (newVal) {
            UserService.updateSettings(newVal);
        }
    }, true);

    $scope.$watch("email", newVal => {
        UserService.email = newVal;
    });

    $scope.$watch("password", newVal => {
        UserService.password = newVal;
    });

    $scope.logOut = function () {
        UserService.logout(() => {
            $scope.session = null;
            $scope.user = null;
            $scope.settings = null;
            $rootScope.isModerator = false;
        });
    };

    $scope.logIn = function () {
        if ($scope.buttonState !== "logIn") {
            $scope.buttonState = "logIn";
            return;
        }
        UserService.login($scope.email, $scope.password, (err, user) => {
            if (err) {
                AlertService.danger(err);
            } else {
                $scope.session = UserService.session;
                $scope.user = user;
                UserService.getUserSettings(settings => {
                    $scope.settings = settings || {};
                });
                UserService.getUserType(type => {
                    $rootScope.isModerator = type === "Moderator";
                });
                UserService.isSuper(isSuper => {
                    $rootScope.isSuper = isSuper;
                });
            }
        });
    };

    $scope.signUp = function () {
        if ($scope.buttonState !== "signUp") {
            $scope.buttonState = "signUp";
            return;
        }
        $scope.email = $scope.email.trim().toLowerCase();
        if (!$scope.email.match(emailRegex)) {
            return AlertService.danger("Email must be a valid email");
        }
        if ($scope.password !== $scope.password_check) {
            return AlertService.danger("Passwords do not match");
        }
        if (!checkPasswords($scope.password, $scope.password_check)) {
            return AlertService.danger("Password need to be more complex");
        }
        ModalService.openWaiverModal()
            .result
            .then(res => {
                UserService.signUp($scope.email, $scope.password, $scope.name, (err, res) => {
                    if (err) {
                        AlertService.danger(err);
                    } else {
                        AlertService.info(res);
                    }
                });
            }, err => {
                AlertService.danger("The waiver must be accepted");
            });
    };

    $scope.tagCode = function () {
        if (!$scope.taggedCode || !$scope.taggedDescription) {
            return;
        }
        UserService.reportTag($scope.taggedCode, $scope.user.playerCode, $scope.taggedDescription, $scope.location, (err, res) => {
            if (err) {
                AlertService.danger(err);
            } else {
                delete $scope.taggedCode;
                delete $scope.taggedDescription;
                delete $scope.location;
                AlertService.info(res);
            }
        });
    };

    $scope.supplyCodeReport = function () {
        if (!$scope.supplyCode) {
            return;
        }
        UserService.reportSupplyCode($scope.supplyCode, $scope.user._id, (err, res) => {
            if (err) {
                AlertService.danger(err);
            } else {
                delete $scope.supplyCode;
                AlertService.info(res);
            }
        });
    };
}

module.exports = {
    name: "UserCtrl",
    fn: UserCtrl
};
