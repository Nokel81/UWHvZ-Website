function ModalService($uibModal) {
    "ngInject";

    const SERVICE = {};

    SERVICE.openWaiverModal = function () {
        return $uibModal.open({
            controller: "WaiverCtrl",
            templateUrl: "views/modals/waiver.html",
            size: "lg"
        });
    };

    SERVICE.openSupplyCodeModal = function (gameId) {
        return $uibModal.open({
            controller: "SupplyCtrl",
            templateUrl: "views/modals/supplyCodes.html",
            resolve: {
                GameId: function () {
                    return gameId;
                },
                DefaultValue: function () {
                    return 5;
                }
            },
            size: "lg"
        });
    };

    SERVICE.openRegisterPlayer = function () {
        return $uibModal.open({
            controller: "RegisterCtrl",
            templateUrl: "views/modals/registerPlayer.html",
            size: "lg"
        });
    };

    SERVICE.openEditPlayer = function (player) {
        return $uibModal.open({
            controller: "EditCtrl",
            templateUrl: "views/modals/editPlayer.html",
            size: "lg",
            resolve: {
                Player: function () {
                    return JSON.parse(JSON.stringify(player));
                }
            }
        });
    };

    return SERVICE;
}

module.exports = {
    name: "ModalService",
    fn: ModalService
};
