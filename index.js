import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import validate from 'express-validation';

import crudValidation from './src/validation/crud';
import routes from './src/routes/routesFactory';
import {DomainsService} from './src/services/domainsService';


let domainInstance = new DomainsService();

//mongoose connection
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/crud', {
    useMongoClient: true
})


// RUN APP
const app = express();

//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({type: 'application/json'}));
app.use(function(req, res, next){
    res.setHeader('Content-Type', 'application/json');
    next();
})


// Run and call my array of routes
for (let i in routes) {
    routes[i](app);
}

const PORT = 8080;

app.get('/', (req, res) => {
    res.status(200).send(domainInstance.getDomains());
})

app.post('/', validate(crudValidation), (req, res, next) => {
    domainInstance.setDomains(req.body)
    res.status(201).send(req.body);
})

app.listen(PORT, () => console.log(`your server is running on port ${PORT}`));