function ToggleDirective() {
    "ngInject";

    return {
        restrict: "E",
        templateUrl: "../views/directives/toggle.html",
        transclude: true,
        require: "ngModel",
        scope: {
            values: "@",
            titles: "@",
            colours: "@",
            width: "@"
        },
        link: (scope, element, attrs, ngModel) => {
            let values = JSON.parse("[" + scope.values.replace(/([^\\]?)'/g, "$1\"") + "]");
            let colours = JSON.parse("[" + scope.colours.replace(/([^\\]?)'/g, "$1\"") + "]");
            let titles = JSON.parse("[" + (scope.titles || "").replace(/([^\\]?)'/g, "$1\"") + "]");
            const span = angular.element(element[0].firstChild);
            let index;

            scope.$watch(() => ngModel.$viewValue, newVal => {
                console.log(newVal);
                if (!newVal) {
                    index = 0;
                }
                if (newVal !== values[index]) {
                    let intr = values.findIndex((elem) => elem === newVal);
                    if (intr < 0) {
                        intr = 0;
                    }
                    index = intr;
                    span.text(titles[index]);
                    element.css("background", colours[index]);
                    ngModel.$setViewValue(values[index]);
                }
            });

            let active = true;
            while (titles.length < values.length) {
                let val = values[titles.length].toString();
                titles.push(val);
            }
            while (colours.length < values.length) {
                let val = colours[colours.length - 1];
                colours.push(val);
            }
            element.css({
                "width": scope.width
            });

            element.on("mouseover", () => {
                active = !attrs.disabled;
            });

            element.on("click", () => {
                if (active) {
                    index = (index + 1) % titles.length;
                    span.addClass("animate-right");
                    span.text(titles[index]);
                    ngModel.$setViewValue(values[index]);
                    element.css("background", colours[index]);
                    setTimeout(() => {
                        span.removeClass("animate-right");
                    }, 200);
                }
            });
        }
    };
}

module.exports = {
    name: "hvzToggle",
    fn: ToggleDirective
};
