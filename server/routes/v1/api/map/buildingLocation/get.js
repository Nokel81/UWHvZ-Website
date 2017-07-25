const getByAcronym = rootRequire("server/data-access/functions/buildingLocations/getByAcronym");
const createErrorMessage = rootRequire("server/helpers/createErrorMessage");

function Get(req, res, next) {
    const {acronym} = req.query;
    getByAcronym(acronym)
    .then(location => {
        res.status(200).json(location);
    })
    .catch(error => {
        res.status(404).send("Polygon not found: " + createErrorMessage(error));
    });
}

module.exports = Get;
