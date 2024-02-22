import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";

let route = express.Router();

let initWebRoute = (app) => {
    route.get('/', homeController.getHomePage);
    route.get('/about', homeController.getAboutPage);
    route.get('/crud', homeController.getCRUD);
    route.post('/post-crud', homeController.postCRUD);
    route.get('/get-crud', homeController.displayGetCRUD);
    route.get('/edit-crud', homeController.getEditCRUD);
    route.post('/put-crud', homeController.putCRUD);
    route.get('/delete-crud', homeController.deleteCRUD);

    route.post('/api/login', userController.handlelogin);
    route.get('/api/get-all-users', userController.handleGetAllUser);
    route.post('/api/create-new-user', userController.handleCreateNewUser);
    route.put('/api/edit-user', userController.handleEditNewUser);
    route.delete('/api/delete-user', userController.handleDeleteNewUser);
    route.get('/api/allCode', userController.getAllCode);

    route.get('/api/top-doctor-home', doctorController.getTopDoctorHome);

    return app.use("/", route);
}

module.exports = initWebRoute;