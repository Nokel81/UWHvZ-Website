function FileDirective($parse) {
    "ngInject";

    return {
        restrict: "A",
        link: (scope, element, attrs) => {
            element.on("change", function() {
                $parse(attrs.fileInput)
                    .assign(scope, element[0].files);
            });
        }
    };
}

module.exports = {
    name: "fileInput",
    fn: FileDirective
};
