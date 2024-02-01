const { Router } = require('express');
const { param, body, query } = require('express-validator');

// Middlewares
const catchError = require('./app/middlewares/catchError');

// Controllers
const StatusController = require('./app/controllers/StatusController');
const SystemController = require('./app/controllers/SystemController');

const routes = new Router();

routes.get('/', (req, res) => {
    return res.status(200).json({
        message: true,
        code: 200,
    });
});

// Status routes
routes.get('/status/:id', param(['id']).escape(), StatusController.show);
routes.get('/status', StatusController.index);
routes.post('/status', body(['name', 'names']), StatusController.store);

// System routes
routes.get('/system/migrate', query(['undo']).escape(), SystemController.migrate);

routes.use(catchError);

module.exports = routes;
