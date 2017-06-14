function InfoCtrl($scope, GameService, AppSettings) {
    "ngInject";
    $scope.game = {};
    const days = AppSettings.days;
    const months = AppSettings.months;

    const addZero = function(i) {
        return (i < 10 ? "0" : "") + i;
    };

    const getGetOrdinal = function(n) {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    $scope.game = GameService.getClosestOrCurrent(gameObj => {
        $scope.game = gameObj;
    });

    $scope.getLatLng = function (name) {
        let marker = AppSettings.buildingMarkerLocations[name];
        if (!marker) {
            return "";
        }
        return "?lat=" + marker.lat + "&lng=" + marker.lng + "&title=" + marker.title;
    };

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
}

module.exports = {
    name: "InfoCtrl",
    fn: InfoCtrl
};
