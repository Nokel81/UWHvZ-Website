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

    return SERVICE;
}

module.exports = {
    name: "ModalService",
    fn: ModalService
};
