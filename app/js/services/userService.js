function UserService($http, AppSettings, $cookies, $rootScope) {
    "ngInject";
    const SERVICE = {};

    SERVICE.email = "";
    SERVICE.password = "";
    SERVICE.session = $cookies.get("session");
    SERVICE.userId = null;

    SERVICE.getUserType = function(cb) {
        if (!SERVICE.userId) {
            return cb(null);
        }
        $http.get(AppSettings.apiUrl + "/user/type")
            .then(res => {
                cb(res.data);
            }, () => {
                cb(null);
            });
    };

    SERVICE.updateSettings = function(newSettings) {
        if (!newSettings._id || !newSettings.userId) {
            return;
        }
        $http.post(AppSettings.apiUrl + "/user/settings", newSettings)
            .then(() => {}, err => {
                console.error(err);
            });
    };

    SERVICE.updateUser = function (user, cb) {
        $http.put(AppSettings.apiUrl + "/user/update", user)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.getPlayerCodePage = function (cb) {
        const config = {
            responseType: "blob"
        };
        $http.get(AppSettings.apiUrl + "/user/pdf", config)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.getBySession = function(cb) {
        if (!SERVICE.session) {
            return cb(null);
        }
        $http.get(AppSettings.apiUrl + "/user/session")
            .then(res => {
                SERVICE.userId = res.data._id;
                cb(res.data);
            }, () => {
                cb(null);
                SERVICE.session = null;
                $cookies.remove("session");
            });
    };

    SERVICE.deleteUser = function (user, cb) {
        $http.delete(AppSettings.apiUrl + "/user/remove?userId=" + user._id)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.login = function(email, password, cb) {
        if (typeof email !== "string" || typeof password !== "string") {
            return cb("email or password is incorrect");
        }
        const body = {
            username: email.toString(),
            password: password.toString()
        };
        $http.post(AppSettings.apiUrl + "/user/login", body)
            .then(res => {
                SERVICE.session = res.data.session.sessionToken;
                SERVICE.userId = res.data.user._id;
                $cookies.put("session", SERVICE.session);
                cb(null, res.data.user);
            },
                err => {
                    $cookies.remove("session");
                    cb(err.data);
                });
    };

    SERVICE.logout = function(cb) {
        if (!SERVICE.session) {
            return;
        }
        $http.post(AppSettings.apiUrl + "/user/logout")
            .then(() => {
                SERVICE.userId = null;
                SERVICE.session = null;
                $cookies.remove("session");
                $rootScope.isModerator = false;
                $rootScope.isSuper = false;
                cb();
            }, () => {
                SERVICE.userId = null;
                SERVICE.session = null;
                $cookies.remove("session");
                $rootScope.isModerator = false;
                $rootScope.isSuper = false;
                cb();
            });
    };

    SERVICE.signUp = function(email, password, name, teamPreference, cb) {
        const body = {
            email,
            password,
            playerName: name,
            teamPreference
        };
        $http.post(AppSettings.apiUrl + "/user", body)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.confirmEmail = function(token, cb) {
        const body = {
            token
        };
        $http.post(AppSettings.apiUrl + "/user/token", body)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.getUserSettings = function(cb) {
        if (!SERVICE.userId) {
            return cb(null);
        }
        $http.get(AppSettings.apiUrl + "/user/settings")
            .then(res => {
                cb(res.data);
            }, () => {
                cb(null);
            });
    };

    SERVICE.reportTag = function(taggedCode, tagger, description, location, time, cb) {
        const body = {
            tagger,
            taggedCode,
            description,
            location,
            time
        };
        $http.post(AppSettings.apiUrl + "/report/submit", body)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.reportSupplyCode = function(supplyCode, userId, cb) {
        const body = {
            userId,
            code: supplyCode
        };
        $http.put(AppSettings.apiUrl + "/supply", body)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.isSuper = function(cb) {
        if (!SERVICE.userId) {
            return cb(false);
        }
        $http.get(AppSettings.apiUrl + "/user/super")
            .then(res => {
                cb(res.data);
            }, () => {
                cb(false);
            });
    };

    SERVICE.changePassword = function(oldPassword, newPassword, cb) {
        if (!SERVICE.userId) {
            return;
        }
        const body = {
            oldPassword,
            newPassword
        };
        $http.put(AppSettings.apiUrl + "/user/password/secure", body)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.sendPasswordResetEmail = function(email, cb) {
        let body = {
            email
        };
        $http.post(AppSettings.apiUrl + "/user/password", body)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.resetPassword = function(newPassword, code, cb) {
        let body = {
            newPassword,
            code
        };
        $http.put(AppSettings.apiUrl + "/user/password/force", body)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.getValidRecipients = function(cb) {
        $http.get(AppSettings.apiUrl + "/message/recipients")
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.sendMessage = function(to, subject, body, files, cb) {
        $http.post(AppSettings.apiUrl + "/message/attachments", files, {
            transformRequest: angular.identity,
            headers: {
                "Content-Type": undefined
            }
        })
            .then(res => {
                let fileData = res.data;
                let req = {
                    to,
                    subject,
                    body,
                    fileData
                };
                $http.post(AppSettings.apiUrl + "/message", req)
                    .then(res => {
                        cb(null, res.data);
                    }, err => {
                        cb(err.data);
                    });
            }, () => {
                cb("File upload failed");
            });
    };

    SERVICE.getUserInfo = function(cb) {
        $http.get(AppSettings.apiUrl + "/user/info")
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.getAllPlayerInfo = function (cb) {
        $http.get(AppSettings.apiUrl + "/user/all")
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    return SERVICE;
}

module.exports = {
    name: "UserService",
    fn: UserService
};
