const ReadStatus = rootRequire("server/schemas/messageRead");

function Query(query, cb) {
    ReadStatus.find(query)
        .exec((err, stati) => {
            if (err) {
                return cb({ error: err });
            }
            cb({ body: stati });
        });
};

module.exports = Query;
