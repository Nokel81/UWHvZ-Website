function SuperCtrl($scope, UserService, $location, GameService, AlertService, $window, MapService) {
    "ngInject";
    $scope.games = [];
    $scope.markers = [];
    $scope.polygons = [];
    $scope.editingMarker = null;
    $scope.editingPolygon = null;

    UserService.getBySession(() => {
        UserService.isSuper(isSuper => {
            if (!isSuper) {
                $location.url("/");
            }

            UserService.getAllPlayerInfo((err, players) => {
                if (err) {
                    AlertService.danger(err);
                } else {
                    $scope.players = players;
                }
            });

            GameService.getAll((err, games) => {
                if (err) {
                    AlertService.danger(err);
                } else {
                    $scope.games = games || [];
                }
            });

            MapService.getAllMarkers((err, markers) => {
                if (err) {
                    AlertService.danger(err);
                } else {
                    $scope.markers = markers || [];
                }
            });

            MapService.getAllPolygons((err, polygons) => {
                if (err) {
                    AlertService.danger(err);
                } else {
                    $scope.polygons = polygons || [];
                }
            });
        });
    });

    $scope.deleteUser = function (index) {
        if (!$scope.players[index]) {
            return;
        }
        if (!window.confirm("Are you sure you want to attempt to remove '" + $scope.players[index].playerName + "'")) {
            return;
        }
        UserService.deleteUser($scope.players[index], (err, res) => {
            if (err) {
                return AlertService.danger(err);
            }
            AlertService.success("User has been removed");
            $scope.players = res;
        });
    };

    $scope.regenerateCodes = function () {
        GameService.regenerateCodes((err, res) => {
            if (err) {
                AlertService.danger(err);
            } else {
                AlertService.info(res);
            }
        });
    };

    $scope.deleteUnusedSupplyCodes = function () {
        GameService.deleteUnusedSupplyCodes((err, res) => {
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

    $scope.removeLocation = function(game, location) {
        ((($scope.games || [])[game] || {}).signUpLocations || []).splice(location, 1);
        ((($scope.games || [])[game] || {}).signUpLocationDates || []).splice(location, 1);
    };

    $scope.removeLocationDate = function (game, location, date) {
        (((($scope.games || [])[game] || {}).signUpLocationDates || [])[location] || []).splice(date, 1);
    };

    $scope.addLocation = function(game) {
        ((($scope.games || [])[game] || {}).signUpLocations || []).push("");
        ((($scope.games || [])[game] || {}).signUpLocationDates || []).push([]);
    };

    $scope.removeDate = function(game, date) {
        ((($scope.games || [])[game] || {}).signUpDates || []).splice(date, 1);
    };

    $scope.addDate = function(game) {
        ((($scope.games || [])[game] || {}).signUpDates || []).push(new Date());
    };

    $scope.addLocationDate = function (game, location) {
        (((($scope.games || [])[game] || {}).signUpLocationDates || [])[location] || []).push(new Date());
    };

    $scope.addPlayer = function(game, team) {
        if (!$scope.games[game]) {
            return;
        }
        if (!$scope.games[game]._id) {
            return AlertService.warn("Please save the game before adding");
        }
        const code = $window.prompt("New " + team + " player Code", "");
        if (!code) {
            return;
        }
        GameService.addPlayerByCode($scope.games[game]._id, code, team, (err, games) => {
            if (err) {
                return AlertService.danger(err);
            }
            AlertService.info("Player Added");
            $scope.games = games;
        });
    };

    $scope.removePlayer = function(game, index, team) {
        if (!$scope.games[game] || !$scope.games[game][team + "s"] || !$scope.games[game][team + "s"][index]) {
            return;
        }
        let userId = $scope.games[game][team + "Objs"][index]._id;
        let gameId = $scope.games[game]._id;
        GameService.removePlayerById(gameId, userId, team, (err, games) => {
            if (err) {
                return AlertService.danger(err);
            }
            AlertService.info("Player Removed");
            $scope.games = games;
        });
    };

    $scope.addGame = function() {
        $scope.games.push({
            humans: [],
            moderators: [],
            zombies: [],
            humanObjs: [],
            moderatorObjs: [],
            zombieObjs: [],
            spectatorObjs: [],
            signUpDates: [],
            signUpLocations: [],
            isStarted: false
        });
    };

    $scope.saveGame = function(game) {
        if (!$scope.games[game]) {
            return;
        }
        if ($scope.games[game]._id) {
            GameService.updateGame($scope.games[game], (err, updatedGame) => {
                if (err) {
                    return AlertService.danger(err);
                }
                $scope.games[game] = updatedGame;
                AlertService.info("Game updated");
            });
        } else {
            GameService.createGame($scope.games[game], (err, newGame) => {
                if (err) {
                    return AlertService.danger(err);
                }
                $scope.games[game] = newGame;
                AlertService.info("Game created");
            });
        }
    };

    $scope.removeGame = function(game) {
        if (!$scope.games[game]) {
            return;
        }
        const res = $window.confirm("Are you sure you want to delete '" + $scope.games[game].name + "'?");
        if (res) {
            if (!$scope.games[game]._id) {
                return $scope.games.splice(game, 1);
            }
            GameService.deleteGame($scope.games[game]._id, err => {
                if (err) {
                    AlertService.danger(err);
                } else {
                    $scope.games.splice(game, 1);
                }
            });
        }
    };

    $scope.editMarker = function(index) {
        if ($scope.editingMarker !== null || !$scope.markers[index]) {
            return;
        }
        $scope.editingMarker = index;
    };

    $scope.saveMarker = function(index) {
        if ($scope.editingMarker !== index) {
            return;
        }
        if ($scope.markers[index]._id) {
            MapService.updatedMarker($scope.markers[index], (err, res) => {
                if (err) {
                    return AlertService.danger(err);
                }
                $scope.markers = res;
                $scope.editingMarker = null;
            });
        } else {
            MapService.createMarker($scope.markers[index], (err, res) => {
                if (err) {
                    return AlertService.danger(err);
                }
                $scope.markers = res;
                $scope.editingMarker = null;
            });
        }
    };

    $scope.removeMarker = function(index) {
        if ($scope.editingMarker !== index) {
            return;
        }
        if ($scope.markers[index]._id) {
            MapService.removeMarker($scope.markers[index]._id, (err, res) => {
                if (err) {
                    return AlertService.danger(err);
                }
                $scope.markers = res;
                $scope.editingMarker = null;
            });
        } else {
            $scope.markers.splice(index, 1);
            $scope.editingMarker = null;
        }
    };

    $scope.addMarker = function() {
        if ($scope.editingMarker !== null) {
            return;
        }
        $scope.editingMarker = $scope.markers.length;
        $scope.markers.push({});
    };

    $scope.editPolygon = function(index) {
        if ($scope.editingPolygon !== null || !$scope.polygons[index]) {
            return;
        }
        $scope.editingPolygon = index;
    };

    $scope.savePolygon = function(index) {
        if ($scope.editingPolygon !== index) {
            return;
        }
        $scope.polygons[index].points = $scope.polygons[index].points.filter(point => typeof point.lat === "number" && typeof point.lng === "number");
        if ($scope.polygons[index]._id) {
            MapService.updatePolygon($scope.polygons[index], (err, res) => {
                if (err) {
                    AlertService.danger(err);
                } else {
                    $scope.polygons = res;
                    $scope.editingPolygon = null;
                }
            });
        } else {
            MapService.createPolygon($scope.polygons[index], (err, res) => {
                if (err) {
                    AlertService.danger(err);
                } else {
                    $scope.polygons = res;
                    $scope.editingPolygon = null;
                }
            });
        }
    };

    $scope.removePolygon = function(index) {
        if ($scope.editingPolygon !== index) {
            return;
        }
        if ($scope.polygons[index]._id) {
            MapService.deletePolygon($scope.polygons[index]._id, (err, res) => {
                if (err) {
                    AlertService.danger(err);
                } else {
                    $scope.polygons = res;
                    $scope.editingPolygon = null;
                }
            });
        } else {
            $scope.polygons.splice(index + 1, 0, {});
            $scope.editingPolygon = null;
        }
    };

    $scope.addPointAfter = function(rootIndex, index) {
        if ($scope.editingPolygon !== rootIndex || index > $scope.polygons[rootIndex].points.length) {
            return;
        }
        $scope.polygons[rootIndex].points.splice(index + 1, 0, {});
    };

    $scope.removePoint = function(rootIndex, index) {
        if ($scope.editingPolygon !== rootIndex || !$scope.polygons[rootIndex].points[index]) {
            return;
        }
        $scope.polygons[rootIndex].points.splice(index, 1);
    };

    $scope.addPolygon = function() {
        if ($scope.editingPolygon !== null) {
            return;
        }
        $scope.editingPolygon = $scope.polygons.length;
        $scope.polygons.push({
            points: [{}]
        });
    };
}

module.exports = {
    name: "SuperCtrl",
    fn: SuperCtrl
};
