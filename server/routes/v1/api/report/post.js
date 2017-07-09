const create = rootRequire("server/data-access/functions/report/create");

function Post(req, res, next) {
    const report = req.body;
    create(report, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            if (result.error.errors) {
                const errors = Object.keys(result.error.errors).map(error => result.error.errors[error].message).join(", ");
                res.status(400).send("Report not made: " + errors);
            } else {
                res.status(400).send("Report not made: " + result.error);
            }
        } else {
            res.status(201).send(result.body);
        }
    });
}

module.exports = Post;
