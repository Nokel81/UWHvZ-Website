function ModCtrl($scope, $location, UserService, GameService, AlertService, $window, ModalService, ModService, $anchorScroll) {
    "ngInject";
    CKEDITOR.replace('GameLoreTextArea');

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
        $scope.game = game;
        GameService.getRegistrantsForGame(game._id, (err, signups) => {
            if (err) {
                AlertService.danger(err);
            } else {
                $scope.players = signups;
                $scope.gameStarted = !game || game.startDate < new Date();
            }
        });
        GameService.getGamePlayerInfoForMods(game._id, (err, gamePlayers) => {
            if (err) {
                AlertService.danger(err);
            } else {
                $scope.gamePlayers = gamePlayers;
            }
        });
        GameService.getUnratifiedReports(game._id, (err, reports) => {
            if (err) {
                return AlertService.danger(err);
            }
            $scope.reports = reports;
        });
        GameService.getAllReports(game._id, (err, reports) => {
            if (err) {
                return AlertService.danger(err);
            }
            $scope.allReports = reports;
        });
        ModService.getSupplyCodes(game._id, (err, codes) => {
            if (err) {
                AlertService.danger(err);
            } else {
                $scope.supplyCodes = codes;
            }
        });
    });

    $scope.$watch("players", (newval) => {
        if (!newval) {
            return;
        }
        $scope.OZplayers = newval.filter(player => player.teamPreference === "Zombie").map(player => {
            return {
                name: player.name,
                startingTeam: "Human",
                email: player.userEmail
            };
        });
    });

    $scope.addPlayer = function() {
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

    $scope.savePlayer = function(index) {
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

    $scope.editPlayer = function(index) {
        if ($scope.editing !== null || !$scope.players[index] || !$scope.game) {
            return;
        }
        $scope.editing = index;
    };

    $scope.removePlayer = function(index) {
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

    $scope.addCodes = function() {
        ModalService.openSupplyCodeModal($scope.game._id)
            .result
            .then(res => {
                ModService.saveSupplyCodes(res, $scope.game._id, function(err, codes) {
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

    $scope.randomlyChooseOZs = function () {
        let number = Number($window.prompt("New Zombie Player Code", ""));
        if (isNaN(number)) {
            return AlertService.danger("Type a number");
        }
        number = Math.ceil(number);
        if (number < 1) {
            return AlertService.danger("Type a positive number");
        }
        let maxRange = $scope.OZplayers.length;
        let count = 0;
        do {
            let index = Math.floor(Math.random() * maxRange);
            if ($scope.OZplayers[index].startingTeam === "Human") {
                $scope.OZplayers[index].startingTeam = "Zombie";
                $scope.OZplayers[index].random = "True";
                count++;
            }
        } while (count < number);
    };

    $scope.$watch("OZplayers", newval => {
        if (!newval) {
            return;
        }
        newval.forEach(player => {
            if (player.startingTeam === "Human") {
                player.random = "";
            }
        });
    }, true);

    $scope.startGame = function () {
        if (!$window.confirm("Are you sure you want to start the game?")) {
            return;
        }
        if (!CKEDITOR.instances.GameLoreTextArea.getData()) {
            return AlertService.danger("Please type the game lore");
        }
        var fd = new FormData();
        angular.forEach($scope.files, function (file) {
            fd.append('file', file);
        });
        const startingZombies = $scope.OZplayers.filter(player => player.startingTeam === "Zombie").map(player => player.email);
        ModService.startGame(startingZombies, $scope.game._id, CKEDITOR.instances.GameLoreTextArea.getData(), fd, (err, res) => {
            if (err) {
                AlertService.danger(err);
            } else {
                AlertService.info(res);
                CKEDITOR.instances.GameLoreTextArea.setData("");
            }
        });
    };

    $scope.ratifyReport = function (index) {
        if (!$scope.reports[index]) {
            return;
        }
        GameService.ratifyReport($scope.reports[index]._id, $scope.reports[index].gameId, (err, res) => {
            if (err) {
                AlertService.danger(err);
            } else {
                $scope.reports = res;
            }
        });
    };

    $scope.deleteReport = function (index) {
        if (!$scope.reports[index]) {
            return;
        }
        if (!$window.confirm("Are you sure that you want to delete that stun report?")) {
            return;
        }
        GameService.deleteReport($scope.reports[index]._id, $scope.reports[index].gameId, (err, res) => {
            if (err) {
                AlertService.danger(err);
            } else {
                $scope.reports = res;
            }
        });
    };
}

module.exports = {
    name: "ModCtrl",
    fn: ModCtrl
};
