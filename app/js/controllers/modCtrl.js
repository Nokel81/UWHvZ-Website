function ModCtrl($scope, $location, UserService, GameService, AlertService, $window, ModalService, ModService, MapService) {
    "ngInject";
    angular.element(document).ready(() => {
        CKEDITOR.replace("GameLoreTextArea");
    });

    $scope.players = [];
    $scope.editing = null;
    $scope.game = null;

    UserService.getBySession(() => {
        UserService.getUserType(type => {
            UserService.isSuper(isSuper => {
                if (type !== "Moderator" && !isSuper) {
                    $location.url("/");
                }
            });
        });
    });

    function reset() {
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
            GameService.getAllReports(game._id, (err, reports) => {
                if (err) {
                    return AlertService.danger(err);
                }
                $scope.reports = reports;
            });
            ModService.getSupplyCodes(game._id, (err, codes) => {
                if (err) {
                    AlertService.danger(err);
                } else {
                    $scope.supplyCodes = codes;
                }
            });

            MapService.getAllMarkers((err, markers) => {
                if (err) {
                    AlertService.danger(err);
                } else {
                    $scope.markers = markers || [];
                }
            });
        });
    }
    reset();

    $scope.$watch("players", (newval) => {
        if (!newval) {
            return;
        }
        $scope.OZplayers = newval.filter(player => player.teamPreference === "Zombie").map(player => {
            return {
                name: player.name,
                startingTeam: "Human",
                email: player.userEmail,
                random: "False"
            };
        });
    });

    $scope.registerPlayer = function () {
        if ($scope.editing !== null || !$scope.game) {
            return;
        }
        ModalService.openRegisterPlayer()
            .result
            .then(user => {
                ModalService.openWaiverModal()
                    .result
                    .then(() => {
                        UserService.signUp(user.email, user.password, user.name, user.teamPreference, (err, res) => {
                            if (err) {
                                AlertService.danger(err);
                            } else {
                                $scope.players = res;
                                AlertService.info("New Player Registed");
                            }
                        });
                    }, () => {
                        AlertService.danger("The waiver must be accepted");
                    });
            });
    };

    $scope.addNewSignUp = function() {
        if ($scope.editing !== null || !$scope.game) {
            return;
        }
        $scope.editing = $scope.players.length;
        $scope.players.push({
            userEmail: "",
            teamPreference: "Human",
            gameId: $scope.game._id
        });
        setTimeout(() => {
            document.body.scrollTop = document.body.scrollHeight;
        }, 50);
    };

    $scope.saveSignUp = function(index) {
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

    $scope.editSignUp = function(index) {
        if ($scope.editing !== null || !$scope.players[index] || !$scope.game) {
            return;
        }
        $scope.editing = index;
    };

    $scope.removeSignUp = function(index) {
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

    $scope.randomlyChooseOZs = function() {
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

    $scope.startGame = function() {
        if (!$window.confirm("Are you sure you want to start the game?")) {
            return;
        }
        if (!CKEDITOR.instances.GameLoreTextArea.getData()) {
            return AlertService.danger("Please type the game lore");
        }
        var fd = new FormData();
        angular.forEach($scope.files, function(file) {
            fd.append("file", file);
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

    $scope.ratifyReport = function(reportId) {
        if (!$window.confirm("Are you sure that you want to ratify this stun report?")) {
            return;
        }
        GameService.ratifyReport(reportId, $scope.game._id, (err, res) => {
            if (err) {
                AlertService.danger(err);
            } else {
                $scope.reports = res;
            }
        });
    };

    $scope.deleteReport = function(reportId) {
        if (!$window.confirm("Are you sure that you want to delete that stun report?")) {
            return;
        }
        GameService.deleteReport(reportId, $scope.game._id, (err, res) => {
            if (err) {
                AlertService.danger(err);
            } else {
                $scope.reports = res;
            }
        });
    };

    $scope.unsuppliedDeath = function() {
        if (!$window.confirm("Are you sure you want to kill all unsupplied humans?")) {
            return;
        }
        if (!$scope.game) {
            return;
        }
        ModService.unsuppliedDeath($scope.game._id, (err, res) => {
            if (err) {
                AlertService.danger(err);
            } else {
                AlertService.info(res);
            }
        });
    };

    $scope.getYear = function(date) {
        if (!(date instanceof Date)) {
            return new Date().getFullYear();
        }
        return date.getFullYear();
    };

    $scope.removeLocation = function(location) {
        ($scope.game.signUpLocations || []).splice(location, 1);
        ($scope.game.signUpLocationDates || []).splice(location, 1);
    };

    $scope.removeLocationDate = function (game, location, date) {
        (($scope.game.signUpLocationDates || [])[location] || []).splice(date, 1);
    };

    $scope.addLocation = function() {
        ($scope.game.signUpLocations || []).push("");
        ($scope.game.signUpLocationDates || []).push([]);
    };

    $scope.removeDate = function(date) {
        ($scope.game.signUpDates || []).splice(date, 1);
    };

    $scope.addDate = function() {
        ($scope.game.signUpDates || []).push(new Date());
    };

    $scope.addLocationDate = function (game, location) {
        (($scope.game.signUpLocationDates || [])[location] || []).push(new Date());
    };

    $scope.removeModerator = function(mod) {
        if ($scope.game) {
            const _id = ($scope.game.moderatorObjs.splice(mod, 1)[0] || {})._id;
            $scope.game.moderators = ($scope.game.moderators || []).filter(id => id !== _id);
        }
    };

    $scope.addPlayer = function(team) {
        if (!$scope.game) {
            return;
        }
        const code = $window.prompt("New " + team + " player Code", "");
        if (!code) {
            return;
        }
        GameService.addPlayerByCode($scope.game._id, code, team, (err, games) => {
            if (err) {
                return AlertService.danger(err);
            }
            AlertService.info("Player Added");
            $scope.games = games;
        });
    };

    $scope.removePlayer = function(index, team) {
        if (!$scope.game || !$scope.game[team + "s"] || !$scope.game[team + "s"][index]) {
            return;
        }
        let userId = $scope.game[team + "Objs"][index]._id;
        let gameId = $scope.game._id;
        GameService.removePlayerById(gameId, userId, team, (err, games) => {
            if (err) {
                return AlertService.danger(err);
            }
            AlertService.info("Player Removed");
            $scope.games = games;
        });
    };

    $scope.saveGame = function() {
        if (!$scope.game) {
            return;
        }
        if ($scope.game._id) {
            GameService.updateGame($scope.game, (err, updatedGame) => {
                if (err) {
                    return AlertService.danger(err);
                }
                $scope.game = updatedGame;
                AlertService.info("Game updated");
            });
        } else {
            GameService.createGame($scope.game, (err, newGame) => {
                if (err) {
                    return AlertService.danger(err);
                }
                $scope.game = newGame;
                AlertService.info("Game created");
            });
        }
    };
}

module.exports = {
    name: "ModCtrl",
    fn: ModCtrl
};
