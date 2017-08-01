function InfoCtrl($scope, GameService, AppSettings, MapService, AlertService) {
    "ngInject";
    $scope.game = null;
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
            });
            GameService.getGameReportGraphs((err, graphs) => {
                if (err) {
                    return AlertService.danger(err);
                }
                let container = document.getElementById('reportGraphs');
                let groups = new vis.DataSet();
                groups.add({
                    id: "Stuns",
                    content: "Stuns",
                    options: {
                        drawPoints: false
                    }
                });
                groups.add({
                    id: "Zombies",
                    content: "Zombies",
                    options: {
                        drawPoints: false
                    }
                });
                let options = {
                    width:  '100%',
                    legend: true,
                    sort: false,
                    start: gameObj.startDate.toISOString(),
                    end: gameObj.endDate.toISOString(),
                    interpolation: false
                };
                var dataset = new vis.DataSet(graphs);
                $scope.numberOfZombies = (graphs.filter(node => node.group === "Zombies").find((e, i, a) => i === a.length - 1) || {y: 0}).y;
                $scope.numberOfStuns = (graphs.filter(node => node.group === "Stuns").find((e, i, a) => i === a.length - 1) || {y: 0}).y;
                new vis.Graph2d(container, dataset, groups, options);
            });
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
