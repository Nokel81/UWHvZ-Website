function Query(query, sort, cb) {
    Message.find(query)
        .sort(sort)
        .exec((err, messages) => {
            if (err) {
                return cb({ error: err });
            }
            cb({ body: messages });
        });
};

module.exports = Query;
