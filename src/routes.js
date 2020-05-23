const routes = require("express").Router();

const CovidController = require("./app/controllers/CovidController");

routes.get("/covid", CovidController.get);

module.exports = routes;
