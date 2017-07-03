const login = rootRequire("server/data-access/functions/user/login");

function Post (req, res, next) {
    const account = req.body;
    login(account, (result) => {
        if (!result) {
            res.status(500).send("Internal Server Error");
        } else if (result.error) {
            res.status(401).send(result.error);
        } else {
            res.status(200).send(result.body);
        }
    });
};

module.exports = Post;
