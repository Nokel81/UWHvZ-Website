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

    return SERVICE;
}

module.exports = {
    name: "ModalService",
    fn: ModalService
};
