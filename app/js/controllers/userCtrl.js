function UserCtrl($scope, UserService, $cookies, AlertService, $location, $rootScope, ModalService, $window) {
    "ngInject";
    $scope.supportsColour = true;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
        CKEDITOR.replace('MessageBodyTextArea', {
            toolbarGroups: [{
                    name: 'document',
                    groups: ['mode', 'document']
                }, {
                    name: 'clipboard',
                    groups: ['clipboard', 'undo']
                }, {
                    name: 'insert'
                }, {
                    name: 'basicstyles',
                    groups: ['basicstyles', 'cleanup']
                }, {
                    name: 'links'
                }
            ]
        });
    } else {
        CKEDITOR.replace('MessageBodyTextArea');
    }

    try {
        var input = document.createElement("input");
        input.type = "color";
        $scope.supportsColour = input.type === "color";
    } catch(e) {
        $scope.supportsColour = false;
    }

    $scope.buttonState = "logIn";
    $scope.email = UserService.email;
    $scope.password = UserService.password;
    $scope.session = UserService.session;
    $scope.validRecipients = [];
    $scope.time = new Date();
    $scope.time.setMilliseconds(0);
    $scope.time.setSeconds(0);
    $scope.userInfo = {
        status: "Please wait, loading..."
    };
    var currentlyTagging = false;
    var currentlySending = false;
    $scope.hasTimeBeenChanged = false;

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

    $scope.$watch(() => $location.hash(), () => {
        $scope.time = new Date();
        $scope.time.setMilliseconds(0);
        $scope.time.setSeconds(0);
        $scope.hasTimeBeenChanged = false;
    });

    $scope.timeHasChanged = function () {
        $scope.hasTimeBeenChanged = true;
    }

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
        UserService.getUserInfo(user._id, (err, info) => {
            if (info) {
                if (typeof info.score === "string") {
                    $scope.userInfo.status = info.score;
                    return;
                }
                delete $scope.userInfo.status;
                $scope.userInfo.teamScore = info.teamScore;
                $scope.userInfo.playerScore = info.score.reportScore.score + info.score.reportScore.tagScore + info.score.supplyCodeScore.score;
                $scope.userInfo.playerStunScore = info.score.reportScore.score;
                $scope.userInfo.playerTagScore = info.score.reportScore.tagScore;
                $scope.userInfo.playerSupplyScore = info.score.supplyCodeScore.score;
                $scope.userInfo.playerType = info.playerType;
                $scope.userInfo.stuns = info.score.reportScore.descriptions;
                $scope.userInfo.tags = info.score.reportScore.tagDescriptions;
                $scope.userInfo.codes = info.score.supplyCodeScore.descriptions;
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
            $scope.userInfo = {
                status: "Please wait, loading..."
            };
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
                delete $scope.taggedCode;
                delete $scope.taggedDescription;
                delete $scope.location;
                delete $scope.time;
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
        if (!$scope.name || $scope.name[0] === "#") {
            return AlertService.danger("Please type in your name");
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
        if (currentlyTagging) {
            return;
        }
        if (!$scope.taggedCode || !$scope.taggedDescription || !$scope.time) {
            return AlertService.danger("Need more information");
        }
        if (!$scope.hasTimeBeenChanged && !$window.confirm("You have not changed the time that the event happened, are you sure it just happened?")) {
            return;
        }
        currentlyTagging = true;
        AlertService.info("Sending report");
        UserService.reportTag($scope.taggedCode, $scope.user._id, $scope.taggedDescription, $scope.location, $scope.time, (err, res) => {
            if (err) {
                AlertService.danger(err);
            } else {
                delete $scope.taggedCode;
                delete $scope.taggedDescription;
                delete $scope.location;
                $scope.time = new Date();
                $scope.time.setMilliseconds(0);
                $scope.time.setSeconds(0);
                AlertService.info(res);
                $scope.hasTimeBeenChanged = false;
            }
            currentlyTagging = false;
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

    $scope.sendMessage = function() {
        if (currentlySending) {
            return;
        }
        if (!$scope.messageTo) {
            return AlertService.danger("Please select a recipient");
        }
        if (!$scope.messageSubject) {
            return AlertService.danger("Please type a subject");
        }
        if (!CKEDITOR.instances.MessageBodyTextArea.getData()) {
            return AlertService.danger("Please type a message body");
        }
        var fd = new FormData();
        angular.forEach($scope.files, function(file) {
            fd.append('file', file);
        });
        let messageBody = CKEDITOR.instances.MessageBodyTextArea.getData() + "<p>- " + $scope.user.playerName + "</p>";
        if (["AllPlayers", "Moderators", "Zombies", "AllUsers", "Humans"].indexOf($scope.messageTo) >= 0) {
            AlertService.info("With many recipients this message while take some time to send");
        }
        currentlySending = true;
        AlertService.info("Sending message");
        UserService.sendMessage($scope.messageTo, $scope.messageSubject, messageBody, fd, (err, res) => {
            if (err) {
                AlertService.danger(err);
            } else {
                AlertService.info(res);
                $scope.messageTo = "";
                $scope.messageSubject = "";
                CKEDITOR.instances.MessageBodyTextArea.setData("");
            }
            currentlySending = false;
        });
    };
}

module.exports = {
    name: "UserCtrl",
    fn: UserCtrl
};
