function SuperCtrl($scope, UserService, $location, GameService, AlertService, $window, MapService) {
    "ngInject";
    $scope.games = [];
    $scope.markers = [];
    $scope.polygons = [];
    $scope.editingMarker = null;
    $scope.editingPolygon = null;

    UserService.getBySession((user) => {
        UserService.isSuper(isSuper => {
            if (!isSuper) {
                $location.url("/");
            }
        });
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

    $scope.removeLocation = function (game, location) {
        ((($scope.games || [])[game] || {}).signUpLocations || []).splice(location, 1);
    };

    $scope.addLocation = function (game) {
        ((($scope.games || [])[game] || {}).signUpLocations || []).push("");
    };

    $scope.removeDate = function (game, date) {
        ((($scope.games || [])[game] || {}).signUpDates || []).splice(date, 1);
    };

    $scope.addDate = function (game) {
        ((($scope.games || [])[game] || {}).signUpDates || []).push(new Date());
    };

    $scope.removeModerator = function (game, mod) {
        if ($scope.games[game]) {
            let _id = ($scope.games[game].moderator_objs.splice(mod, 1)[0] || {})._id;
            $scope.games[game].moderators = ($scope.games[game].moderators || []).filter(id => id != _id);
        }
    }

    $scope.addModerator = function (game) {
        let code = $window.prompt("New Moderator Player Code", "");
        UserService.getByCode(code, function (err, user) {
            if (err) {
                return AlertService.danger(err);
            }
            $scope.games[game].moderator_objs.push(user);
            $scope.games[game].moderators.push(user._id);
        });
    };

    $scope.removeHuman = function (game, mod) {
        if ($scope.games[game]) {
            let _id = ($scope.games[game].human_objs.splice(mod, 1)[0] || {})._id;
            $scope.games[game].humans = ($scope.games[game].humans || []).filter(id => id != _id);
        }
    }

    $scope.addHuman = function (game) {
        let code = $window.prompt("New Human Player Code", "");
        UserService.getByCode(code, function (err, user) {
            if (err) {
                return AlertService.danger(err);
            }
            $scope.games[game].human_objs.push(user);
            $scope.games[game].humans.push(user._id);
        });
    };

    $scope.removeZombie = function (game, mod) {
        if ($scope.games[game]) {
            let _id = ($scope.games[game].zombie_objs.splice(mod, 1)[0] || {})._id;
            $scope.games[game].zombies = ($scope.games[game].zombies || []).filter(id => id != _id);
        }
    }

    $scope.addZombie = function (game) {
        let code = $window.prompt("New Zombie Player Code", "");
        UserService.getByCode(code, function (err, user) {
            if (err) {
                return AlertService.danger(err);
            }
            $scope.games[game].zombie_objs.push(user);
            $scope.games[game].zombies.push(user._id);
        });
    };

    $scope.addGame = function () {
        $scope.games.push({
            humans: [],
            moderators: [],
            zombies: [],
            human_objs: [],
            moderator_objs: [],
            zombie_objs: [],
            signUpDates: [],
            signUpLocations: []
        });
    };

    $scope.saveGame = function (game) {
        if (!$scope.games[game]) {
            return;
        }
        if ($scope.games[game]._id) {
            GameService.updateGame($scope.games[game], function (err, updatedGame) {
                if (err) {
                    return AlertService.danger(err);
                }
                $scope.games[game] = updatedGame;
                AlertService.info("Game updated");
            });
        } else {
            GameService.createGame($scope.games[game], function (err, newGame) {
                if (err) {
                    return AlertService.danger(err);
                }
                $scope.games[game] = newGame;
                AlertService.info("Game created");
            });
        }
    };

    $scope.removeGame = function (game) {
        if (!$scope.games[game]) {
            return;
        }
        let res = $window.confirm("Are you sure you want to delete '" + $scope.games[game].name + "'?");
        if (res) {
            if (!$scope.games[game]._id) {
                return $scope.games.splice(game, 1);
            }
            GameService.deleteGame($scope.games[game]._id, function (err) {
                if (err) {
                    AlertService.danger(err);
                } else {
                    $scope.games.splice(game, 1);
                }
            });
        }
    };

    $scope.editMarker = function (index) {
        if ($scope.editingMarker !== null || !$scope.markers[index]) {
            return;
        }
        $scope.editingMarker = index;
    };

    $scope.saveMarker = function (index) {
        if ($scope.editingMarker !== index) {
            return;
        }
        if ($scope.markers[index]._id) {
            MapService.updatedMarker($scope.markers[index], function (err, res) {
                if (err) {
                    return AlertService.danger(err);
                }
                $scope.markers = res;
                $scope.editingMarker = null;
            });
        } else {
            MapService.createMarker($scope.markers[index], function (err, res) {
                if (err) {
                    return AlertService.danger(err);
                }
                $scope.markers = res;
                $scope.editingMarker = null;
            });
        }
    };

    $scope.removeMarker = function (index) {
        if ($scope.editingMarker !== index) {
            return;
        }
        if ($scope.markers[index]._id) {
            MapService.removeMarker($scope.markers[index]._id, function (err, res) {
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

    $scope.addMarker = function () {
        if ($scope.editingMarker !== null) {
            return;
        }
        $scope.editingMarker = $scope.markers.length;
        $scope.markers.push({});
    }
}

module.exports = {
    name: "SuperCtrl",
    fn: SuperCtrl
};
