import db from "../models/index";
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);

        } catch (e) {
            reject(e);
        }

    })
}

let handleUserlogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {

                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password'],
                    where: { email: email },
                    raw: true,
                })
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "ok";
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password!";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = "user not found";
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = "Email is not exist";

            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }

    })
}

let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: email },
            })
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId }
                })
            }

            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email is exist
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    message: 'Email is already in use'
                })
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phonenumber,
                    gender: data.gender === "1" ? true : false,
                    roleId: data.roleId,
                })
                resolve({
                    errCode: 0,
                    message: 'OK',
                });
            }

        } catch (error) {
            reject(error);
        }
    })
}

let deleteUser = (UserId) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: { id: UserId },
        })
        if (!user) {
            resolve({
                errCode: 2,
                errMessage: 'The user is not exist',
            })
        }
        //user.destroy() chỉ hiểu khi sd instance của sequelize vì config.json dử dụng "query": {"raw": true} nên ko dùng đc await user.destroy();
        // await user.destroy();
        await db.User.destroy({
            where: { id: UserId }
        })
        resolve({
            errCode: 0,
            message: 'The user is deleted',
        });
    })
}

let editUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing require parameter'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();
                resolve({
                    errCode: 0,
                    message: 'Update user success'
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'User not found'
                });
            }
        } catch (error) {
            reject(error);
        }
    })

}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let res = {};
                let allCode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allCode;
                resolve(res);
            }


        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleUserlogin: handleUserlogin,
    getAllUser: getAllUser,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    editUserData: editUserData,
    getAllCodeService: getAllCodeService,
}