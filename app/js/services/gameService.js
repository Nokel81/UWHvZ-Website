function GameService($http, AppSettings, $cookies, UserService) {
    "ngInject";

    const SERVICE = {};

    SERVICE.getClosestOrCurrent = function (cb) {
        $http.get(AppSettings.apiUrl + "/game/next")
            .then(res => {
                res = res.data;
                if (typeof res === "object") {
                    res.startDate = new Date(res.startDate);
                    res.endDate = new Date(res.endDate);
                    res.signUpDates = res.signUpDates.map(date => new Date(date));
                    cb(res);
                } else {
                    cb(null);
                }
            },
            err => {
                console.error(err);
                cb(null);
            });
    };

    SERVICE.isDateBeforeToday = function (date) {
        if (!(date instanceof Date)) {
            return false;
        }
        const now = new Date();
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

    SERVICE.registerPlayerForGame = function (player, cb) {
        $http.post(AppSettings.apiUrl + "/game/signups", player)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.updatePlayerForGame = function (player, cb) {
        $http.put(AppSettings.apiUrl + "/game/signups", player)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.getRegistrantsForGame = function (gameId, cb) {
        $http.get(AppSettings.apiUrl + "/game/signups?gameId=" + gameId)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.removeRegistrantForGame = function (player, cb) {
        $http.delete(AppSettings.apiUrl + "/game/signups?id=" + player._id)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.getAll = function (cb) {
        $http.get(AppSettings.apiUrl + "/game/all")
            .then(res => {
                res.data.forEach(game => {
                    game.startDate = new Date(game.startDate);
                    game.endDate = new Date(game.endDate);
                    game.signUpDates = game.signUpDates.map(date => new Date(date));
                });
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.deleteGame = function (id, cb) {
        $http.delete(AppSettings.apiUrl + "/game?id=" + id, {"set-cookie": $cookies.get("session")})
            .then(res => {
                cb(null);
            }, err => {
                cb(err.data || {});
            });
    };

    SERVICE.updateGame = function (game, cb) {
        $http.put(AppSettings.apiUrl + "/game", game, {"set-cookie": $cookies.get("session")})
            .then(res => {
                const game = res.data;
                game.startDate = new Date(game.startDate);
                game.endDate = new Date(game.endDate);
                game.signUpDates = game.signUpDates.map(date => new Date(date));
                cb(null, game);
            }, err => {
                cb(err.data || {});
            });
    };

    SERVICE.createGame = function (game, cb) {
        $http.post(AppSettings.apiUrl + "/game", game, {"set-cookie": $cookies.get("session")})
            .then(res => {
                const game = res.data;
                game.startDate = new Date(game.startDate);
                game.endDate = new Date(game.endDate);
                game.signUpDates = game.signUpDates.map(date => new Date(date));
                cb(null, game);
            }, err => {
                cb(err.data || {});
            });
    };

    SERVICE.getGamePlayerInfo = function (gameId, cb) {
        UserService.getBySession(user => {
            if (!user) {
                return cb("User not found");
            }
            let id = user._id;
            $http.get(AppSettings.apiUrl + "/game/lists?gameId=" + gameId + "&userId=" + id)
                .then(res => {
                    cb(null, res.data);
                }, err => {
                    cb(err.data);
                });
        });
    };

    SERVICE.getGamePlayerInfoForMods = function (gameId, cb) {
        UserService.getBySession(user => {
            if (!user) {
                return cb("User not found");
            }
            let id = user._id;
            $http.get(AppSettings.apiUrl + "/game/lists/mods?gameId=" + gameId + "&userId=" + id)
                .then(res => {
                    cb(null, res.data);
                }, err => {
                    cb(err.data);
                });
        });
    };

    SERVICE.addPlayerByCode = function (gameId, playerCode, team, cb) {
        let body = {
            gameId,
            playerCode,
            team
        };
        $http.post(AppSettings.apiUrl + "/game/add", body)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.removePlayerById = function (gameId, playerId, team, cb) {
        let body = {
            gameId,
            playerId,
            team
        };
        $http.delete(AppSettings.apiUrl + "/game/add", body)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    return SERVICE;
}

module.exports = {
    name: "GameService",
    fn: GameService
};
