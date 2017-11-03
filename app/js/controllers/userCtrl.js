function UserCtrl($scope, UserService, $cookies, AlertService, $location, $rootScope, ModalService) {
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

    var currentlyTagging = false;
    var currentlySending = false;

    const checkPasswords = function(password, passwordCheck) {
        return password.length >= 8 && password == passwordCheck;
    };

    $scope.rand = function () {
        return Math.random();
    };

    function reset() {
        $scope.buttonState = "logIn";
        $scope.session = UserService.session;
        delete $scope.validRecipients;
        $scope.taggingCode = {};
        $scope.supplyCodeReporting = {};
        $scope.changingPassword = {};
        $scope.message = {};
        delete $scope.userInfo;
        UserService.getBySession(user => {
            $scope.user = user;
            if (!user) {
                return;
            }
            UserService.getUserSettings(settings => {
                $scope.settings = settings || {};
            });
            UserService.getValidRecipients((err, recipients) => {
                if (recipients) {
                    $scope.validRecipients = recipients;
                }
            });
            UserService.getUserType(type => {
                $rootScope.isModerator = type === "Moderator";
            });
            UserService.isSuper(isSuper => {
                $rootScope.isSuper = isSuper;
            });
            UserService.getUserInfo((err, info) => {
                if (err) {
                    return $scope.userInfo = "nogame";
                } else {
                    $scope.userInfo = info;
                }
            });
        });
    }
    reset();

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
                $rootScope.loggedIn = true;
                reset();
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

    $scope.tagCode = function() {
        if (currentlyTagging) {
            return;
        }
        const {
            taggedCode,
            taggedDescription,
            location,
            date
        } = $scope.taggingCode;
        if (!taggedCode || !taggedDescription || !date || !location) {
            return AlertService.danger("Need more information");
        }
        date.setMilliseconds(0);
        currentlyTagging = true;
        AlertService.info("Sending report");
        UserService.reportTag(taggedCode, $scope.user._id, taggedDescription, location, date, (err, res) => {
            if (err) {
                AlertService.danger(err);
            } else {
                delete $scope.taggingCode.taggedCode;
                delete $scope.taggingCode.taggedDescription;
                delete $scope.taggingCode.location;
                delete $scope.taggingCode.date;
                AlertService.info(res);
            }
            currentlyTagging = false;
        });
    };

    $scope.supplyCodeReport = function() {
        const {
            supplyCode
        } = $scope.supplyCodeReporting;
        if (!supplyCode) {
            return;
        }
        UserService.reportSupplyCode(supplyCode, $scope.user._id, (err, res) => {
            if (err) {
                AlertService.danger(err);
            } else {
                delete $scope.supplyCodeReporting.supplyCode;
                AlertService.info(res);
            }
        });
    };

    $scope.changePassword = function() {
        const {
            newPassword,
            newPasswordCheck,
            oldPassword
        } = $scope.changingPassword;
        if (!newPassword) {
            return;
        }
        if (newPassword !== newPasswordCheck) {
            return AlertService.danger("New passwords don't match");
        }
        if (!checkPasswords(newPassword, newPasswordCheck)) {
            return AlertService.danger("New password is not complex enough");
        }
        UserService.changePassword(oldPassword, newPassword, (err, res) => {
            if (err) {
                AlertService.danger(err);
            } else {
                AlertService.info(res);
                $scope.buttonState = "logIn";
                delete $scope.email;
                delete $scope.password;
                delete $scope.changingPassword.newPassword;
                delete $scope.changingPassword.newPasswordCheck;
                delete $scope.changingPassword.oldPassword;
            }
        });
    };

    $scope.sendMessage = function() {
        if (currentlySending) {
            return;
        }
        const {
            messageTo,
            messageSubject,
            files
        } = $scope.message;
        if (!messageTo) {
            return AlertService.danger("Please select a recipient");
        }
        if (!messageSubject) {
            return AlertService.danger("Please type a subject");
        }
        if (!CKEDITOR.instances.MessageBodyTextArea.getData()) {
            return AlertService.danger("Please type a message body");
        }
        var fd = new FormData();
        angular.forEach(files, function(file) {
            fd.append("file", file);
        });
        let messageBody = CKEDITOR.instances.MessageBodyTextArea.getData() + "<p>- " + $scope.user.playerName + "</p>";
        currentlySending = true;
        AlertService.info("Sending message");
        UserService.sendMessage(messageTo, messageSubject, messageBody, fd, (err, res) => {
            if (err) {
                AlertService.danger(err);
            } else {
                AlertService.info(res);
                delete $scope.message.messageTo;
                delete $scope.message.messageSubject;
                delete $scope.message.files;
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
