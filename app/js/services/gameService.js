function GameService($http, AppSettings) {
    "ngInject";

    let closestOrCurrent = null;

    const SERVICE = {};

    SERVICE.getClosestOrCurrent = function (cb) {
        $http.get(AppSettings.apiUrl + "/game/next")
            .then(res => {
                res = res.data;
                res.startDate = new Date(res.startDate);
                res.endDate = new Date(res.endDate);
                res.signUpDates = res.signUpDates.map(date => new Date(date));
                cb(res);
                closestOrCurrent = res;
            })
            .catch(err => {
                console.error(err);
                cb(null);
                closestOrCurrent = null;
            });
        return closestOrCurrent;
    };

    return SERVICE;
}

module.exports = {
    name: "GameService",
    fn: GameService
};
