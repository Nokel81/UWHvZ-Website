function UserService($http, AppSettings, $cookies) {
    "ngInject";
    const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const SERVICE = {};

    SERVICE.email = "";
    SERVICE.password = "";
    SERVICE.session = $cookies.get("session");
    SERVICE.userId = null;

    const check_passwords = function (password, password_check) {
        if (password.length < 8 || password !== password_check) {
            return false;
        }
        let hasUpperCase = /[A-Z]/.test(password);
        let hasLowerCase = /[a-z]/.test(password);
        let hasNumbers = /\d/.test(password);
        let hasNonalphas = /\W/.test(password);
        return hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas >= 3;
    };

    SERVICE.updateSettings = function (newSettings) {
        if (!newSettings._id || !newSettings.userId) {
            return;
        }
        $http.post(AppSettings.apiUrl + "/user/settings", newSettings)
            .then((res) => {}, (err) => {
                console.error(err);
            });
    };

    SERVICE.getBySession = function (cb) {
        if (!SERVICE.session) {
            return cb(null);
        }
        $http.get(AppSettings.apiUrl + "/user/session?session=" + SERVICE.session)
            .then((res) => {
                SERVICE.userId = res.data._id;
                cb(res.data);
            },
            (err) => {
                cb(null);
            });
    }

    SERVICE.login = function (email, password, cb) {
        if (typeof email !== "string" || typeof password !== "string") {
            return cb("email or password is incorrect");
        }
        let body = {
            username: email.toString(),
            password: password.toString()
        };
        $http.post(AppSettings.apiUrl + "/user/login", body)
            .then((res) => {
                SERVICE.session = res.data.session;
                SERVICE.userId = res.data.user._id;
                $cookies.put("session", res.data.session);
                cb(null, res.data.user);
            },
            (err) => {
                $cookies.remove("session");
                cb(err.error);
            });
    };

    SERVICE.logout = function (cb) {
        if (!SERVICE.session) {
            return;
        }
        $http.post(AppSettings.apiUrl + "/user/logout/" + SERVICE.session)
            .then((res) => {
                SERVICE.userId = null;
                SERVICE.session = null;
                $cookies.remove("session");
                cb();
            },
            (err) => {
                SERVICE.userId = null;
                SERVICE.session = null;
                $cookies.remove("session");
                cb();
            });
    };

    SERVICE.signUp = function (email, password, password_check, name, cb) {
        if (!email.trim().toLowerCase().match(email_regex)) {
            return cb("Email must be a valid email");
        }
        if (!check_passwords(password, password_check)) {
            return cb("Passwords need to match and be complex enough");
        }
        let body = {
            email: email,
            password: password,
            playerName: name
        };
        $http.post(AppSettings.apiUrl + "/user", body)
            .then((res) => {
                cb(null, res.data);
            },
            (err) => {
                cb(err.data);
            });
    };

    SERVICE.confirmEmail = function (token, cb) {
        let body = {
            token: token
        };
        $http.post(AppSettings.apiUrl + "/user/token", body)
            .then((res) => {
                cb(null, res.data);
            },
            (err) => {
                cb(err.data);
            });
    };

    SERVICE.getUserSettings = function (cb) {
        if (!SERVICE.userId) {
            return cb(null);
        }
        $http.get(AppSettings.apiUrl + "/user/settings?userId=" + SERVICE.userId)
            .then((res) => {
                cb(null, res.data);
            },
            (err) => {
                cb(err.data);
            });
    };

    SERVICE.reportTag = function (taggedCode, taggerCode, decription, location, cb) {
        let body = {
            taggerCode: taggerCode,
            taggedCode: taggedCode,
            decription: decription,
            location: location
        };
        $http.post(AppSettings.apiUrl + "/report", body)
            .then((res) => {
                cb(null, res.data);
            },
            (err) => {
                cb(err.data);
            });
    };

    SERVICE.reportSupplyCode = function (supplyCode, userId, cb) {
        let body = {
            userId: userId,
            code: supplyCode
        };
        $http.put(AppSettings.apiUrl + "/supply", body)
        .then((res) => {
            cb(null, res.data);
        },
        (err) => {
            cb(err.data);
        });
    };

    return SERVICE;
}

module.exports = {
    name: "UserService",
    fn: UserService
};
