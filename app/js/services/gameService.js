function GameService($http, AppSettings, $cookies, UserService) {
    "ngInject";

    const SERVICE = {};

    SERVICE.getClosestOrCurrent = function (cb) {
        $http.get(AppSettings.apiUrl + "/game/next")
            .then(res => {
                const game = res.data;
                if (typeof game === "object") {
                    game.startDate = new Date(game.startDate);
                    game.endDate = new Date(game.endDate);
                    game.signUpDates = game.signUpDates.map(date => new Date(date));
                    cb(game);
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
        $http.delete(AppSettings.apiUrl + "/game/signups?userId=" + player._id)
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
        $http.delete(AppSettings.apiUrl + "/game/structural?gameId=" + id)
            .then(res => {
                cb(null);
            }, err => {
                cb(err.data || {});
            });
    };

    SERVICE.updateGame = function (game, cb) {
        $http.put(AppSettings.apiUrl + "/game", game)
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
        $http.post(AppSettings.apiUrl + "/game/structural", game)
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
        $http.get(AppSettings.apiUrl + "/game/lists?gameId=" + gameId)
        .then(res => {
            cb(null, res.data);
        }, err => {
            cb(err.data);
        });
    };

    SERVICE.getGamePlayerInfoForMods = function (gameId, cb) {
        $http.get(AppSettings.apiUrl + "/game/lists/mods?gameId=" + gameId)
        .then(res => {
            cb(null, res.data);
        }, err => {
            cb(err.data);
        });
    };

    SERVICE.getGameReportGraphs = function (cb) {
        $http.get(AppSettings.apiUrl + "/graphs/report")
        .then(res => {
            cb(null, res.data);
        }, err => {
            cb(err.data);
        });
    };

    SERVICE.addPlayerByCode = function (gameId, playerCode, team, cb) {
        let body = {
            gameId,
            playerCode,
            team
        };
        $http.post(AppSettings.apiUrl + "/game/players", body)
            .then(res => {
                let games = res.data;
                games.forEach(game => {
                    game.startDate = new Date(game.startDate);
                    game.endDate = new Date(game.endDate);
                    game.signUpDates = game.signUpDates.map(date => new Date(date));
                });
                cb(null, games);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.removePlayerById = function (gameId, userId, team, cb) {
        $http.delete(AppSettings.apiUrl + "/game/players?gameId=" + gameId + "&userId=" + userId + "&team=" + team)
            .then(res => {
                let games = res.data;
                games.forEach(game => {
                    game.startDate = new Date(game.startDate);
                    game.endDate = new Date(game.endDate);
                    game.signUpDates = game.signUpDates.map(date => new Date(date));
                });
                cb(null, games);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.getAllReports = function (gameId, cb) {
        $http.get(AppSettings.apiUrl + "/report?gameId=" + gameId)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.ratifyReport = function (reportId, gameId, cb) {
        let body = {reportId, gameId};
        $http.put(AppSettings.apiUrl + "/report", body)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.deleteReport = function (reportId, gameId, cb) {
        $http.delete(AppSettings.apiUrl + "/report?reportId=" + reportId + "&gameId=" + gameId)
            .then(res => {
                cb(null, res.data);
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.getTrees = function (userId, cb) {
        $http.get(AppSettings.apiUrl + "/graphs/tree")
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
