const Message = rootRequire("server/schemas/message");

function UpdateById(id, newMessage, cb) {
    Message.findOneAndUpdate({ _id: id }, newMessage, (err, message) => {
        if (err) {
            return cb({ error: err });
        }
        cb({ body: message });
    });
};

module.exports = UpdateById;
