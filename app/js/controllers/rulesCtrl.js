function RulesCtrl($scope, $location, $anchorScroll, $window) {
    "ngInject";
    const scrollButton = angular.element(document.getElementById('scrollToTop'));

    $scope.$watch(() => {
        return $location.hash();
    }, newVal => {
        if (newVal !== "_") {
            $anchorScroll(newVal);
        }
        $location.hash("_");
    });

    $window.addEventListener("scroll", () => {
        let offSet = $window.pageYOffset;
        if (offSet > 0) {
            scrollButton.addClass("scroll-visible");
        } else {
            scrollButton.removeClass("scroll-visible");
        }
    });

    $scope.gotoTop = function (location) {
        $anchorScroll(location);
    };
}

module.exports = {
    name: "RulesCtrl",
    fn: RulesCtrl
};
