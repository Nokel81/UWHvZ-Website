function EditCtrl($scope, $uibModalInstance, AlertService, Player) {
    "ngInject";

    $scope.player = Player;

    $scope.accept = function() {
        if (!$scope.player.email || !$scope.player.email.includes("@")) {
            return AlertService.danger("Email must be a valid email");
        }
        $scope.player.email = $scope.player.email.trim().toLowerCase();
        if (!$scope.player.playerName) {
            return AlertService.danger("Please type in your name");
        }
        const {player: {email, playerName, playerCode}} = $scope;
        const user = {email, playerName, playerCode};
        $uibModalInstance.close(user);
    };

    $scope.decline = function() {
        $uibModalInstance.dismiss();
    };
}

module.exports = {
    name: "EditCtrl",
    fn: EditCtrl
};
