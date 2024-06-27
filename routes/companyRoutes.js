const express = require('express');
const companyRouter = express.Router();
const companyController = require('../controller/companyController');
const auth = require('../middleware/auth');
// define the route for adding a company
companyRouter.post('/users/:userId/companies',auth.verifyToken, companyController.addCompany);


//public Routes
companyRouter.get('/companies', companyController.getAllCompanies);

module.exports = companyRouter;