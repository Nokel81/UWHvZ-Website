module.exports = function (parameterName, minlength) {
    return {
        isAsync: false,
        validator: value => value.length >= minlength,
        message: parameterName + " must have at least " + minlength + " entries"
    };
};
