const objectPath = require("object-path");

function ToggleDirective() {
    "ngInject";

    return {
        restrict: 'E',
        templateUrl: '../views/directives/toggle.html',
        transclude: true,
        require: 'ngModel',
        scope: {
            values: '@',
            titles: '@',
            colours: '@',
            width: '@'
        },
        link: (scope, element, attrs, ngModel) => {
            let values = JSON.parse("[" + scope.values.replace(/([^\\]?)'/g, "$1\"") + "]");
            let colours = JSON.parse("[" + scope.colours.replace(/([^\\]?)'/g, "$1\"") + "]");
            let titles = JSON.parse("[" + (scope.titles || "").replace(/([^\\]?)'/g, "$1\"") + "]");
            let tempVal = objectPath.get(scope.$parent, ngModel.$$attr.ngModel);
            let index = values.findIndex((elem) => elem === tempVal);
            const span = element[0].firstChild.firstChild;
            console.log(span);
            let active = true;
            if (index === -1) {
                index = 0;
            }
            while (titles.length < values.length) {
                let val = values[titles.length].toString();
                titles.push(val);
            }
            while (colours.length < values.length) {
                let val = colours[colours.length - 1];
                colours.push(val);
            }
            scope.titletext = titles[index];
            ngModel.$setViewValue(values[index]);
            element.css({
                "width": scope.width,
                "background": colours[index] || "#888"
            });

            element.on('mouseover', function() {
                if (attrs.disabled) {
                    active = false;
                    element.css("cursor", "not-allowed");
                } else {
                    active = true
                    element.css("cursor", "");
                }
            });

            element.on('click', function() {
                if (active) {
                    index = (index + 1) % titles.length;
                    angular.element(span).addClass("animate-right");
                    scope.titletext = titles[index];
                    ngModel.$setViewValue(values[index]);
                    element.css("background", colours[index]);
                    setTimeout(function () {
                        angular.element(span).removeClass("animate-right");
                    }, 200);
                }
            });

            scope.$watch(() => ngModel.$viewValue, function(newVal) {
                if (newVal !== values[index]) {
                    let intr = values.findIndex((elem) => elem === ngModel.$viewValue);
                    if (intr >= 0) {
                        index = intr;
                        scope.titletext = titles[index];
                        element.css("background", colours[index]);
                    }
                }
            });
        }
    };
}

module.exports = {
    name: 'hvzToggle',
    fn: ToggleDirective
};
