const updateById = rootRequire("server/data-access/functions/gameSignups/updateById");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Put(req, res, next) {
    const signup = req.body;
    updateById(signup)
    .then(signups => {
        res.status(200).json(signups);
    })
    .catch(error => {
        res.status(400).send("Signup not updated: " + createErrorMessage(error));
    });
}

module.exports = Put;
