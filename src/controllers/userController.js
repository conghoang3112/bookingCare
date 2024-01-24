import userService from "../services/userService";

let handlelogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: "Missing input"
        })
    }

    let userData = await userService.handleUserlogin(email, password);

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    });
}

let handleGetAllUser = async (req, res) => {
    let id = req.body.id;//all, id
    if (!id) {
        return res.status(200).json({
            errCode: 0,
            errMessage: 'Missing required param',
            users: []
        })
    }
    let users = await userService.getAllUser(id);
    console.log(users);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'ok',
        users
    })
}

module.exports = {
    handlelogin: handlelogin,
    handleGetAllUser: handleGetAllUser,
}