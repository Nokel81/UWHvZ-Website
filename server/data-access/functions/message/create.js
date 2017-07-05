const Message = rootRequire("server/schemas/message");

function Create(message, cb) {
    const newMessage = new Message(message);
    newMessage.validate(err => {
        if (err) {
            return cb({error: err});
        }
        newMessage.save((err, message) => {
            if (err) {
                return cb({error: err});
            }
            cb({body: message});
        });
    });
}

module.exports = Create;
