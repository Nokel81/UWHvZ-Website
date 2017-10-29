function UserCtrl($scope, UserService, $cookies, AlertService, $location, $rootScope, ModalService, $window) {
    "ngInject";
    $scope.supportsColour = true;
    angular.element(document).ready(() => {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
            CKEDITOR.replace("MessageBodyTextArea", {
                toolbarGroups: [{
                    name: "clipboard",
                    groups: ["clipboard", "undo"]
                }, {
                    name: "insert"
                }, {
                    name: "basicstyles",
                    groups: ["basicstyles", "cleanup"]
                }, {
                    name: "links"
                }]
            });
        } else {
            CKEDITOR.replace("MessageBodyTextArea");
        }
    });

    $scope.buttonState = "logIn";
    $scope.email = UserService.email;
    $scope.password = UserService.password;
    $scope.session = UserService.session;
    $scope.validRecipients = [];
    $scope.time = new Date();
    $scope.time.setMilliseconds(0);
    $scope.time.setSeconds(0);
    $scope.userInfo = null;
    $scope.hasTimeBeenChanged = false;
    var currentlyTagging = false;
    var currentlySending = false;

    const checkPasswords = function(password, passwordCheck) {
        return password.length >= 8 && password == passwordCheck;
    };

    $scope.$watch(() => $location.hash(), () => {
        $scope.time = new Date();
        $scope.time.setMilliseconds(0);
        $scope.time.setSeconds(0);
        $scope.hasTimeBeenChanged = false;
    });

    $scope.timeHasChanged = function() {
        $scope.hasTimeBeenChanged = true;
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
        UserService.getUserInfo(user._id, (err, info) => {
            if (err) {
                return $scope.userInfo = "nogame";
            }
            if (info) {
                $scope.userInfo = info;
                $scope.userInfo.teamScore = info.teamScore;
                $scope.userInfo.playerScore = info.userScore.stunScore + info.userScore.tagScore + info.userScore.codeScore;
                $scope.userInfo.playerStunScore = info.userScore.stunScore;
                $scope.userInfo.playerTagScore = info.userScore.tagScore;
                $scope.userInfo.playerSupplyScore = info.userScore.codeScore;
                $scope.userInfo.userType = info.userType;
                $scope.userInfo.stuns = info.userScore.stunDescriptions;
                $scope.userInfo.tags = info.userScore.tagDescriptions;
                $scope.userInfo.codes = info.userScore.codeDescriptions;
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
                $rootScope.loggedIn = true;
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

    $scope.playerCodePage = function () {
        AlertService.info("Generating PDF");
        UserService.getPlayerCodePage((err, blob) => {
            if (err) {
                return AlertService.danger(err);
            }
            AlertService.success("Finished");
            var link = document.createElement("a");
            link.setAttribute("type", "hidden");
            link.download = "playerCodeSheet.pdf";
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
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
        if (!$scope.name || $scope.name[0] === "#") {
            return AlertService.danger("Please type in your name");
        }
        ModalService.openWaiverModal()
            .result
            .then(() => {
                UserService.signUp($scope.email, $scope.password, $scope.name, null, (err, res) => {
                    if (err) {
                        AlertService.danger(err);
                    } else {
                        AlertService.info(res);
                    }
                });
            }, () => {
                AlertService.danger("The waiver must be accepted");
            });
    };

    $scope.submitAuthenticationForm = function() {
        if ($scope.buttonState === "logIn") {
            $scope.logIn();
        } else if ($scope.buttonState === "signUp") {
            $scope.signUp();
        }
    };

    $scope.taggingCode = {};
    $scope.tagCode = function() {
        if (currentlyTagging) {
            return;
        }
        if (!$scope.taggingCode.taggedCode || !$scope.taggingCode.taggedDescription || !$scope.taggingCode.time) {
            return AlertService.danger("Need more information");
        }
        if (!$scope.taggingCode.hasTimeBeenChanged && !$window.confirm("You have not changed the time that the event happened, are you sure it just happened?")) {
            return;
        }
        currentlyTagging = true;
        AlertService.info("Sending report");
        UserService.reportTag($scope.taggingCode.taggedCode, $scope.user._id, $scope.taggingCode.taggedDescription, $scope.taggingCode.location, $scope.taggingCode.time, (err, res) => {
            if (err) {
                AlertService.danger(err);
            } else {
                delete $scope.taggingCode.taggedCode;
                delete $scope.taggingCode.taggedDescription;
                delete $scope.taggingCode.location;
                $scope.taggingCode.time = new Date();
                $scope.taggingCode.time.setMilliseconds(0);
                $scope.taggingCode.time.setSeconds(0);
                AlertService.info(res);
                $scope.taggingCode.hasTimeBeenChanged = false;
            }
            currentlyTagging = false;
        });
    };

    $scope.supplyCodeReporting = {};
    $scope.supplyCodeReport = function() {
        if (!$scope.supplyCodeReporting.supplyCode) {
            return;
        }
        UserService.reportSupplyCode($scope.supplyCodeReporting.supplyCode, $scope.user._id, (err, res) => {
            if (err) {
                AlertService.danger(err);
            } else {
                delete $scope.supplyCodeReporting.supplyCode;
                AlertService.info(res);
            }
        });
    };

    $scope.changingPassword = {};
    $scope.changePassword = function() {
        console.log($scope.changingPassword);
        if (!$scope.changingPassword.newPassword) {
            return;
        }
        if ($scope.changingPassword.newPassword !== $scope.changingPassword.newPasswordCheck) {
            return AlertService.danger("New passwords don't match");
        }
        if (!checkPasswords($scope.changingPassword.newPassword, $scope.changingPassword.newPasswordCheck)) {
            return AlertService.danger("New password is not complex enough");
        }
        UserService.changePassword($scope.changingPassword.oldPassword, $scope.changingPassword.newPassword, (err, res) => {
            if (err) {
                AlertService.danger(err);
            } else {
                AlertService.info(res);
                $scope.buttonState = "logIn";
                $scope.email = "";
                $scope.password = "";
                $scope.changingPassword.newPassword = "";
                $scope.changingPassword.newPasswordCheck = "";
                $scope.changingPassword.oldPassword = "";
            }
        });
    };

    $scope.message = {};
    $scope.sendMessage = function() {
        if (currentlySending) {
            return;
        }
        if (!$scope.message.messageTo) {
            return AlertService.danger("Please select a recipient");
        }
        if (!$scope.message.messageSubject) {
            return AlertService.danger("Please type a subject");
        }
        if (!CKEDITOR.instances.MessageBodyTextArea.getData()) {
            return AlertService.danger("Please type a message body");
        }
        var fd = new FormData();
        angular.forEach($scope.message.files, function(file) {
            fd.append("file", file);
        });
        let messageBody = CKEDITOR.instances.MessageBodyTextArea.getData() + "<p>- " + $scope.user.playerName + "</p>";
        if (["AllPlayers", "Moderators", "Zombies", "AllUsers", "Humans"].indexOf($scope.messageTo) >= 0) {
            AlertService.info("With many recipients this message while take some time to send");
        }
        currentlySending = true;
        AlertService.info("Sending message");
        UserService.sendMessage($scope.message.messageTo, $scope.message.messageSubject, messageBody, fd, (err, res) => {
            if (err) {
                AlertService.danger(err);
            } else {
                AlertService.info(res);
                $scope.message.messageTo = "";
                $scope.message.messageSubject = "";
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
