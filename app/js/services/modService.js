function ModService($http, AppSettings) {
    "ngInject";

    const SERVICE = {};

    SERVICE.saveSupplyCodes = function (codes, gameId, cb) {
        let body = {codes, gameId};
        $http.post(AppSettings.apiUrl + "/supply/all", body)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.getSupplyCodes = function (gameId, cb) {
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

    return SERVICE;
}

module.exports = {
    name: "ModService",
    fn: ModService
};
