function UserCtrl($scope, UserService, $cookies, AlertService, $location, $rootScope, ModalService, $http, AppSettings) {
    "ngInject";
    $scope.buttonState = "logIn";
    $scope.email = UserService.email;
    $scope.password = UserService.password;
    $scope.session = UserService.session;
    $scope.validRecipients = [];

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

    UserService.getBySession(user => {
        $scope.user = user;
        if (!user) {
            return;
        }
        UserService.getUserSettings(settings => {
            $scope.settings = settings || {};
        });
        UserService.getValidRecipients(user._id, (err, recipients) => {
            if (recipients) {
                $scope.validRecipients = recipients;
            }
        });
    });

    if ($location.search().token) {
        const token = $location.search().token;
        $cookies.remove("session");
        $scope.session = null;
        UserService.session = null;
        UserService.user = null;
        $location.search("token", null); // Removes the search parameter
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

    $scope.forgotPassword = function() {
        if (!$scope.email) {
            return AlertService.danger("No email provided");
        }
        UserService.sendPasswordResetEmail($scope.email, (err, res) => {
            if (err) {
                AlertService.danger(err);
            } else {
                AlertService.info(res);
            }
        });
    };

    $scope.logOut = function() {
        UserService.logout(() => {
            $scope.session = null;
            $scope.user = null;
            $scope.settings = null;
            $rootScope.isModerator = false;
        });
    };

    $scope.logIn = function() {
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
                UserService.getValidRecipients(user._id, (err, recipients) => {
                    if (recipients) {
                        $scope.validRecipients = recipients;
                    }
                });
            }
        });
    };

    $scope.signUp = function() {
        if ($scope.buttonState !== "signUp") {
            $scope.buttonState = "signUp";
            return;
        }
        if (!$scope.email) {
            return AlertService.danger("Email must be a valid email");
        }
        $scope.email = $scope.email.trim().toLowerCase();
        if ($scope.password !== $scope.passwordCheck) {
            return AlertService.danger("Passwords do not match");
        }
        if (!checkPasswords($scope.password, $scope.passwordCheck)) {
            return AlertService.danger("Password need to be more complex");
        }
        if (!$scope.joinNextGame) {
            $scope.teamPreference = null;
        }
        ModalService.openWaiverModal()
            .result
            .then(res => {
                UserService.signUp($scope.email, $scope.password, $scope.name, $scope.teamPreference, (err, res) => {
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

    $scope.tagCode = function() {
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

    $scope.supplyCodeReport = function() {
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

    $scope.changePassword = function() {
        if ($scope.newPassword !== $scope.newPasswordCheck) {
            return AlertService.danger("New passwords don't match");
        }
        if (!checkPasswords($scope.newPassword, $scope.newPasswordCheck)) {
            return AlertService.danger("New password is not complex enough");
        }
        UserService.changePassword($scope.oldPassword, $scope.newPassword, (err, res) => {
            if (err) {
                AlertService.danger(err);
            } else {
                AlertService.info(res);
                $scope.buttonState = "logIn";
                $scope.email = "";
                $scope.password = "";
                $scope.newPassword = "";
                $scope.newPasswordCheck = "";
                $scope.oldPassword = "";
            }
        });
    };

    $scope.upload = function () {
        var fd = new FormData();
        angular.forEach($scope.files, function (file) {
            fd.append('file', file);
        });

        $http.post(AppSettings.apiUrl + "/message/attachments", fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .then(function (res) {})
    }

    $scope.sendMessage = function() {
        if (!$scope.messageTo) {
            return AlertService.danger("Please select a recipient");
        }
        if (!$scope.messageSubject) {
            return AlertService.danger("Please type a subject");
        }
        if (!$scope.messageBody) {
            return AlertService.danger("Please type a message body");
        }
        var fd = new FormData();
        angular.forEach($scope.files, function (file) {
            fd.append('file', file);
        });
        AlertService.info("For many recipients this may take a few seconds to send");
        UserService.sendMessage($scope.messageTo, $scope.messageSubject, $scope.messageBody, fd, (err, res) => {
            if (err) {
                AlertService.danger(err);
            } else {
                AlertService.info(res);
                $scope.messageTo = "";
                $scope.messageSubject = "";
                $scope.messageBody = "";
            }
        });
    };
}

module.exports = {
    name: "UserCtrl",
    fn: UserCtrl
};
