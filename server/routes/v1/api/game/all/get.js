const findAll = rootRequire("server/data-access/functions/game/findAll");

function Get(req, res, next) {
    findAll(result => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(400).send("Games not found: " + result.error);
        } else {
            res.status(200).send(result.body);
        }
    });
}

module.exports = Get;
