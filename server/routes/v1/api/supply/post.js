const create = rootRequire("server/data-access/functions/supplyCode/create");

function Post(req, res, next) {
    const supplyCode = req.body;
    create(supplyCode, (result) => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            let errors = Object.keys(result.error.errors).map(error => result.error.errors[error].message).join(", ");
            res.status(400).send("Supply Code not made: " + errors);
        } else {
            res.status(201).send(result.body);
        }
    });
};

module.exports = Post;
