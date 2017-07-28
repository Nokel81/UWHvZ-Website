const deleteById = rootRequire("server/data-access/functions/gameSignups/deleteById");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Delete(req, resolve, reject) {
    const {id} = req.query;
    deleteById(id)
    .then(signups => {
        resolve(signups);
    })
    .catch(error => {
        reject("Signup not deleted: " + createErrorMessage(error));
    });
}

module.exports = Delete;
