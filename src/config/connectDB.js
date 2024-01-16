const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sql_bookingCare', 'root', "12345678", {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

let connectDB = async() => {
    try {
        await sequelize.authenticate();
        console.log('Connect successfully');
    } catch (error) {
        console.log('Unable to connect database: ', error);
    }
}

module.exports = connectDB;