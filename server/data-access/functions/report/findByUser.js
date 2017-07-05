const Report = rootRequire("server/schemas/report");

function FindByUser(userCode, cb) {
    Report.find({taggedCode: userCode})
        .exec((err, reports) => {
            if (err) {
                return cb({error: err});
            }
            cb({body: reports});
        });
}

module.exports = FindByUser;
