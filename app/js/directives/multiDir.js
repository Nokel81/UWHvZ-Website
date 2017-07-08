const objectPath = require("object-path");

function ToggleDirective() {
    "ngInject";

    return {
        restrict: 'EA',
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
            element.text(titles[index]);
            ngModel.$setViewValue(values[index]);
            element.css({
                "-webkit-user-select": "none",
                "-moz-user-select": "none",
                "-ms-user-select": "none",
                "cursor": "pointer",
                "box-sizing": "border-box",
                "outline": "0",
                "width": scope.width,
                "height": "2em",
                "position": "relative",
                "-webkit-transform": "skew(-10deg)",
                "transform": "skew(-10deg)",
                "font-weight": "bold",
                "font-family": "sans-serif",
                "background": colours[index] || "#888",
                "text-align": "center",
                "line-height": "2em",
                "color": "#fff",
                "text-shadow": "0 1px 0 rgba(0, 0, 0, 0.4)",
                "margin-bottom": ".5em",
                "display": "inline-block"
            });

            element.on('mouseover', function () {
                if (attrs.disabled) {
                    element.css("cursor", "not-allowed");
                    active = false;
                } else {
                    element.css("cursor", "pointer");
                    active = true
                }
            });

            element.on('click', function() {
                if (active) {
                    index = (index + 1) % titles.length;
                    element.css("background", colours[index]);
                    element.text(titles[index]);
                    ngModel.$setViewValue(values[index]);
                }
            });

            scope.$watch(() => ngModel.$viewValue, function (newVal) {
                if (newVal !== values[index]) {
                    let intr = values.findIndex((elem) => elem === ngModel.$viewValue);
                    if (intr >= 0) {
                        index = intr;
                        element.text(titles[index]);
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
