function ModService($http, AppSettings) {
    "ngInject";

    const SERVICE = {};

    SERVICE.saveSupplyCodes = function(codes, gameId, cb) {
        let body = {
            codes,
            gameId
        };
        $http.post(AppSettings.apiUrl + "/supply/all", body)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.getSupplyCodes = function(gameId, cb) {
        if (!gameId) {
            return cb("No next game");
        }
        $http.get(AppSettings.apiUrl + "/supply/all?gameId=" + gameId)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.startGame = function(OZemails, gameId, HTMLlore, files, cb) {
        const options = {
            transformRequest: angular.identity,
            headers: {
                "Content-Type": undefined
            }
        };
        $http.post(AppSettings.apiUrl + "/message/attachments", files, options)
            .then(res => {
                let fileData = res.data;
                let body = {
                    OZemails,
                    gameId,
                    HTMLlore,
                    fileData
                };
                const options = {
                    timeout: 600000
                };
                $http.post(AppSettings.apiUrl + "/game/start", body, options)
                    .then(res => {
                        cb(null, res.data);
                    }, err => {
                        cb(err.data);
                    });
            }, () => {
                cb("File upload failed");
            });
    };

    SERVICE.unsuppliedDeath = function(gameId, cb) {
        $http.delete(AppSettings.apiUrl + "/game/unsupplied?gameId=" + gameId)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    return SERVICE;
}

module.exports = {
    name: "ModService",
    fn: ModService
};
