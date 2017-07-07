function ModCtrl($scope, $location, UserService, GameService, AlertService, $window, ModalService, ModService, $anchorScroll) {
    "ngInject";
    $scope.players = [];
    $scope.editing = null;
    $scope.game = null;

    UserService.getBySession(user => {
        UserService.getUserType(type => {
            UserService.isSuper(isSuper => {
                if (type !== "Moderator" && !isSuper) {
                    $location.url("/");
                }
            });
        });
    });

    GameService.getClosestOrCurrent(game => {
        if (!game) {
            return;
        }
        GameService.getRegistrantsForGame(game._id, (err, signups) => {
            if (err) {
                AlertService.danger(err);
            } else {
                $scope.players = signups;
                $scope.game = game;
            }
        });
        ModService.getSupplyCodes(game._id, (err, codes) => {
            if (err) {
                AlertService.danger(err);
            } else {
                $scope.supplyCodes = codes;
            }
        });
    });

    $scope.addPlayer = function () {
        if ($scope.editing !== null || !$scope.game) {
            return;
        }
        $scope.editing = $scope.players.length;
        $scope.players.push({
            userEmail: "",
            teamPreference: "Human",
            gameId: $scope.game._id
        });
        $anchorScroll("bottom");
    };

    $scope.savePlayer = function (index) {
        if ($scope.editing !== index || !$scope.players[index] || !$scope.game) {
            return;
        }
        if (!($scope.players[index].userEmail || "").includes("@")) {
            return;
        }
        if ($scope.players[index]._id) {
            GameService.updatePlayerForGame($scope.players[index], (err, players) => {
                if (err) {
                    return AlertService.danger(err);
                }
                $scope.players = players;
                $scope.editing = null;
            });
        } else {
            GameService.registerPlayerForGame($scope.players[index], (err, players) => {
                if (err) {
                    return AlertService.danger(err);
                }
                $scope.players = players;
                $scope.editing = null;
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
        const res = $window.confirm("Are you sure you want to delete '" + $scope.players[index].userEmail + "'?");
        if (res) {
            if ($scope.players[index]._id) {
                GameService.removeRegistrantForGame($scope.players[index], (err, players) => {
                    if (err) {
                        return AlertService.danger(err);
                    }
                    $scope.players = players;
                    $scope.editing = null;
                });
            } else {
                $scope.players.splice(index, 1);
                $scope.editing = null;
            }
        }
    };

    $scope.addCodes = function () {
        ModalService.openSupplyCodeModal($scope.game._id)
            .result
            .then(res => {
                ModService.saveSupplyCodes(res, $scope.game._id, function (err, codes) {
                    if (err) {
                        return AlertService.danger(err);
                    }
                    AlertService.info("Supply codes saved");
                    $scope.supplyCodes = codes;
                });
            })
            .catch(err => {
                if (err) {
                    AlertService.danger(err);
                }
            });
    };
}

module.exports = {
    name: "ModCtrl",
    fn: ModCtrl
};
