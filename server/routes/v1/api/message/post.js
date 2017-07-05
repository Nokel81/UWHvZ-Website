const create = rootRequire("server/data-access/functions/message/create");

function Post(req, res, next) {
    create(req.body, result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(400).send("Could not create message: " + result.error);
        } else {
            res.status(201).send(result.body);
        }
    });
}

module.exports = Post;
