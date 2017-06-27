const Report = rootRequire("server/schemas/report");

function Create (report, cb) {
    const newReport = new Report(report);
    newReport.validate(err => {
        if (err) {
            return cb({ error: err });
        }
        newReport.save((err, report) => {
            if (err) {
                return cb({ error: err });
            }
            cb({ body: "You tagged " + newReport.taggedCode });
        });
    });
};

module.exports = Create;
