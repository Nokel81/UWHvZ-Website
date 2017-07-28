const getByAcronym = rootRequire("server/data-access/functions/buildingLocations/getByAcronym");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, resolve, reject) {
    const {acronym} = req.query;
    getByAcronym(acronym)
    .then(location => {
        resolve(location);
    })
    .catch(error => {
        reject("Polygon not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
