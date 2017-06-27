function GameService($http, AppSettings) {
    "ngInject";

    const SERVICE = {};

    SERVICE.getClosestOrCurrent = function (cb) {
        $http.get(AppSettings.apiUrl + "/game/next")
            .then(res => {
                res = res.data;
                res.startDate = new Date(res.startDate);
                res.endDate = new Date(res.endDate);
                res.signUpDates = res.signUpDates.map(date => new Date(date));
                cb(res);
            },
            (err) => {
                console.error(err);
                cb(null);
            });
    };

    SERVICE.isDateBeforeToday = function (date) {
        if (!(date instanceof Date)) {
            return false;
        }
        let now = new Date();
        if (date.getFullYear() < now.getFullYear()) {
            return true;
        } else if (date.getFullYear() === now.getFullYear()) {
            if (date.getMonth() < now.getMonth()) {
                return true;
            } else if (date.getMonth() === now.getMonth()) {
                if (date.getDate() < now.getDate()) {
                    return true;
                }
            }
        }
        return false;
    };

    return SERVICE;
}

module.exports = {
    name: "GameService",
    fn: GameService
};
