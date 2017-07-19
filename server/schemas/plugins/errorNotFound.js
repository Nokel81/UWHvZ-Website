function ErrorNotFound(schema) {
    schema.post('findOne', (res, next) => {
        if (!res) {
            return next(new Error("Not found"));
        }
        next();
    });
}

module.exports = ErrorNotFound;
