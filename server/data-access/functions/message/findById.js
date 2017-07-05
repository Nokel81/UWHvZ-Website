const Message = rootRequire("server/schemas/message");

function FindById(id, cb) {
    Message.findById(id, (err, message) => {
        if (err) {
            return cb({error: err});
        }
        cb({body: message});
    });
}

module.exports = FindById;
