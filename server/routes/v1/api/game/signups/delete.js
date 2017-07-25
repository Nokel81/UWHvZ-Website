const deleteById = rootRequire("server/data-access/functions/gameSignups/deleteById");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Delete(req, res, next) {
    const {id} = req.query;
    deleteById(id)
    .then(signups => {
        res.status(200).json(signups);
    })
    .catch(error => {
        res.status(400).send("Signup not deleted: " + createErrorMessage(error));
    });
}

module.exports = Delete;
