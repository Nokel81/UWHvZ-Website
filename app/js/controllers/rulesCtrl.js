function RulesCtrl($scope, $location, $anchorScroll) {
    "ngInject";

    $scope.$watch(() => {
        return $location.hash();
    }, newVal => {
        if (newVal === "top") {
            $location.hash("_");
            $anchorScroll("top");
        }
    });
}

module.exports = {
    name: "RulesCtrl",
    fn: RulesCtrl
};
