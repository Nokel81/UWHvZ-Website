function InfoCtrl($scope, GameService, AppSettings, MapService, AlertService) {
    "ngInject";
    $scope.game = {};
    const days = AppSettings.days;
    const months = AppSettings.months;
    $scope.locationUrls = {};

    const addZero = function (i) {
        return (i < 10 ? "0" : "") + i;
    };

    const getGetOrdinal = function (n) {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    const getLatLngs = function (names, cb) {
        MapService.getAllMarkers((err, markers) => {
            if (err) {
                AlertService.danger(err);
            } else {
                names.forEach(elem => {
                    const marker = markers.find(x => x.acronym === elem);
                    $scope.locationUrls[elem] = "";
                    if (marker) {
                        $scope.locationUrls[elem] = "?lat=" + marker.lat + "&lng=" + marker.lng + "&title=" + marker.title;
                    }
                });
                cb();
            }
        });
    };

    GameService.getClosestOrCurrent(gameObj => {
        if (gameObj) {
            getLatLngs(gameObj.signUpLocations, () => {
                $scope.game = gameObj;
            });

            GameService.getGamePlayerInfo(gameObj._id, (err, lists) => {
                if (err) {
                    return AlertService.danger(err);
                }
                $scope.gameMods = lists.gameMods;
                $scope.gamePlayers = lists.gamePlayers;
                $scope.zombieCount = lists.zombieCount;
                $scope.stunCount = lists.stunCount;
            })
        }
    });

    $scope.getDateString = function (date) {
        if (!(date instanceof Date)) {
            return "";
        }
        return days[date.getDay()] + " " + months[date.getMonth()] + " " + getGetOrdinal(date.getDate()) + " " + date.getFullYear();
    };

    $scope.getTimeString = function (date) {
        if (!(date instanceof Date)) {
            return "";
        }
        return addZero(date.getHours()) + ":" + addZero(date.getMinutes());
    };

    $scope.strikeThrough = function (date) {
        return GameService.isDateBeforeToday(date);
    };
}

module.exports = {
    name: "InfoCtrl",
    fn: InfoCtrl
};
