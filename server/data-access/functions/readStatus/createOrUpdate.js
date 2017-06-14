const ReadStatus = rootRequire("server/schemas/messageRead");

function CreateOrUpdate(usercode, messageId, status, cb) {
    const query = {
        messageId: messageId,
        usercode: usercode
    };
    const readStatus = new ReadStatus({
        messageId: messageId,
        usercode: usercode,
        isRead: Boolean(status)
    });

    readStatus.validate(err => {
        if (err) {
            return cb({ error: err });
        }
        ReadStatus.findOneAndUpdate(query, status, { upsert: true }, (err, status) => {
            if (err) {
                return cb({ error: err });
            }
            cb({ body: status });
        });
    });
};

module.exports = CreateOrUpdate;
