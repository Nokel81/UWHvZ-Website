function HomeCtrl($scope, GameService, AppSettings) {
    "ngInject";
    const days = AppSettings.days;
    const months = AppSettings.months;
    $scope.nextGameString = null;

    GameService.getClosestOrCurrent(gameObj => {
        if (!gameObj) {
            $scope.nextGameString = null;
            return;
        }

        const dateString = days[gameObj.startDate.getDay()] + " " + months[gameObj.startDate.getMonth()] + " " + getGetOrdinal(gameObj.startDate.getDate()) + " " + gameObj.startDate.getFullYear();
        if (gameObj.startDate < Date.now()) {
            $scope.nextGameString = "The current game started on: " + dateString;
        } else {
            $scope.nextGameString = "The next game will start on: " + dateString;
        }
    });

    function getGetOrdinal(n) {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }
}

module.exports = {
    name: "HomeCtrl",
    fn: HomeCtrl
};
