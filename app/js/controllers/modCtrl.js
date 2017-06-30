function ModCtrl($scope, $location, UserService, GameService, AlertService) {
    "ngInject";
    $scope.players = [];
    $scope.editing = null;
    $scope.game = null;

    UserService.getBySession((user) => {
        UserService.getUserType(type => {
            UserService.isSuper(isSuper => {
                if (type !== "Moderator" && !isSuper) {
                    $location.url("/");
                }
            })
        });
    });

    GameService.getClosestOrCurrent(game => {
        if (!game) {
            return;
        }
        GameService.getRegistrantsForGame(game._id, (err, signups) => {
            if (err) {
                AlertService.warn(err);
            } else {
                $scope.players = signups;
                $scope.game = game;
            }
        });
    });

    $scope.addPlayer = function () {
        if ($scope.editing !== null || !$scope.game) {
            return;
        }
        $scope.players.push({
            userEmail: "",
            teamPreference: "Human",
            gameId: $scope.game._id
        });
        $scope.editing = $scope.players.length - 1;
    };

    $scope.savePlayer = function (index) {
        if ($scope.editing !== index || !$scope.players[index] || !$scope.game) {
            return;
        }
        if (!($scope.players[index].userEmail || "").includes("@")) {
            return;
        }
        if ($scope.players[index]._id) {
            GameService.updatePlayerForGame($scope.players[index], function (err, players) {
                if (err) {
                    return AlertService.warn(err);
                } else {
                    $scope.players = players;
                    $scope.editing = null;
                }
            });
        } else {
            GameService.registerPlayerForGame($scope.players[index], function (err, players) {
                if (err) {
                    return AlertService.warn(err);
                } else {
                    $scope.players = players;
                    $scope.editing = null;
                }
            });
        }
    };

    $scope.editPlayer = function (index) {
        if ($scope.editing !== null || !$scope.players[index] || !$scope.game) {
            return;
        }
        $scope.editing = index;
    };

    $scope.removePlayer = function (index) {
        if ($scope.editing !== index || !$scope.players[index] || !$scope.game) {
            return;
        }
        if ($scope.players[index]._id) {
            GameService.removeRegistrantForGame($scope.players[index], function (err, players) {
                if (err) {
                    return AlertService.warn(err);
                } else {
                    $scope.players = players;
                    $scope.editing = null;
                }
            });
        } else {
            $scope.players.splice(index, 1);
            $scope.editing = null;
        }
    };
}

module.exports = {
    name: "ModCtrl",
    fn: ModCtrl
};
