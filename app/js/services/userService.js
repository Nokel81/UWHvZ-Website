function UserService($http, AppSettings, $cookies, $rootScope) {
    "ngInject";
    const SERVICE = {};

    SERVICE.email = "";
    SERVICE.password = "";
    SERVICE.session = $cookies.get("session");
    SERVICE.userId = null;

    SERVICE.getUserType = function (cb) {
        if (!SERVICE.userId) {
            return cb(null);
        }
        $http.get(AppSettings.apiUrl + "/user/type?id=" + SERVICE.userId)
            .then(res => {
                cb(res.data);
            },
            err => {
                cb(null);
            });
    };

    SERVICE.updateSettings = function (newSettings) {
        if (!newSettings._id || !newSettings.userId) {
            return;
        }
        $http.post(AppSettings.apiUrl + "/user/settings", newSettings)
            .then(res => {}, err => {
                console.error(err);
            });
    };

    SERVICE.getBySession = function (cb) {
        if (!SERVICE.session) {
            return cb(null);
        }
        $http.get(AppSettings.apiUrl + "/user/session?session=" + SERVICE.session)
            .then(res => {
                SERVICE.userId = res.data._id;
                cb(res.data);
            },
            err => {
                cb(null);
            });
    };

    SERVICE.login = function (email, password, cb) {
        if (typeof email !== "string" || typeof password !== "string") {
            return cb("email or password is incorrect");
        }
        const body = {
            username: email.toString(),
            password: password.toString()
        };
        $http.post(AppSettings.apiUrl + "/user/login", body)
            .then(res => {
                SERVICE.session = res.data.session;
                SERVICE.userId = res.data.user._id;
                $cookies.put("session", res.data.session);
                cb(null, res.data.user);
            },
            err => {
                $cookies.remove("session");
                cb(err.data);
            });
    };

    SERVICE.logout = function (cb) {
        if (!SERVICE.session) {
            return;
        }
        $http.post(AppSettings.apiUrl + "/user/logout/" + SERVICE.session)
            .then(res => {
                SERVICE.userId = null;
                SERVICE.session = null;
                $cookies.remove("session");
                $rootScope.isModerator = false;
                $rootScope.isSuper = false;
                cb();
            },
            err => {
                SERVICE.userId = null;
                SERVICE.session = null;
                $cookies.remove("session");
                $rootScope.isModerator = false;
                $rootScope.isSuper = false;
                cb();
            });
    };

    SERVICE.signUp = function (email, password, name, cb) {
        const body = {
            email,
            password,
            playerName: name
        };
        $http.post(AppSettings.apiUrl + "/user", body)
            .then(res => {
                cb(null, res.data);
            },
            err => {
                cb(err.data);
            });
    };

    SERVICE.confirmEmail = function (token, cb) {
        const body = {
            token
        };
        $http.post(AppSettings.apiUrl + "/user/token", body)
            .then(res => {
                cb(null, res.data);
            },
            err => {
                cb(err.data);
            });
    };

    SERVICE.getUserSettings = function (cb) {
        if (!SERVICE.userId) {
            return cb(null);
        }
        $http.get(AppSettings.apiUrl + "/user/settings?userId=" + SERVICE.userId)
            .then(res => {
                cb(res.data);
            },
            err => {
                cb(null);
            });
    };

    SERVICE.reportTag = function (taggedCode, taggerCode, decription, location, cb) {
        const body = {
            taggerCode,
            taggedCode,
            decription,
            location
        };
        $http.post(AppSettings.apiUrl + "/report", body)
            .then(res => {
                cb(null, res.data);
            },
            err => {
                cb(err.data);
            });
    };

    SERVICE.reportSupplyCode = function (supplyCode, userId, cb) {
        const body = {
            userId,
            code: supplyCode
        };
        $http.put(AppSettings.apiUrl + "/supply", body)
            .then(res => {
                cb(null, res.data);
            },
            err => {
                cb(err.data);
            });
    };

    SERVICE.isSuper = function (cb) {
        if (!SERVICE.userId) {
            return cb(false);
        }
        $http.get(AppSettings.apiUrl + "/user/super?id=" + SERVICE.userId)
            .then(res => {
                cb(res.data);
            },
            err => {
                cb(false);
            });
    };

    SERVICE.getByCode = function (code, cb) {
        $http.get(AppSettings.apiUrl + "/user/code?playerCode=" + code)
            .then(res => {
                cb(null, res.data);
            },
            err => {
                cb(err.data);
            });
    };

    SERVICE.changePassword = function (oldPassword, newPassword, cb) {
        if (!SERVICE.userId) {
            return;
        }
        const body = {
            oldPassword,
            newPassword,
            userId: SERVICE.userId
        };
        $http.put(AppSettings.apiUrl + "/user/password", body)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.sendPasswordResetEmail = function (email, cb) {
        let body = {email};
        $http.post(AppSettings.apiUrl + "/user/password", body)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.resetPassword = function (newPassword, code, cb) {
        let body = {newPassword, code};
        $http.put(AppSettings.apiUrl + "/user/password/force", body)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.getValidRecipients = function (userId, cb) {
        $http.get(AppSettings.apiUrl + "/message/recipients?userId=" + userId)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.sendMessageNoAttachments = function (to, subject, body, cb) {

    };

    SERVICE.sendMessageWithAttachments = function (to, subject, body, attachments, cb) {
        let file = attachments[0];
        console.log(file);
        var formData = new FormData();
        formData.append('file', file);
        $http.post(AppSettings.apiUrl + "/message/attachments", formData, {
            headers: {'Content-Type': undefined }
        })
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
