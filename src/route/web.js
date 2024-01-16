import express from "express";
import homeController from "../controllers/homeController";

let route = express.Router();

let initWebRoute = (app) => {
    route.get('/', homeController.getHomePage);
    route.get('/about', homeController.getAboutPage);


    return app.use("/", route);
}

module.exports = initWebRoute;