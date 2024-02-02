const { Router } = require('express');
const { param, body, query } = require('express-validator');
const multer = require('multer');

// Middlewares
const catchError = require('./app/middlewares/catchError');
const uploadConfig = require('./app/middlewares/fileUpload');

// Controllers
const StatusController = require('./app/controllers/StatusController');
const SystemController = require('./app/controllers/SystemController');
const UsersControlller = require('./app/controllers/UsersControlller');

const upload = multer(uploadConfig);

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

// getFiles
routes.post('/files', upload.single('file'));

// User routes
routes.get('/users', query(['id', 'login']).escape(), UsersControlller.show);

// System routes
routes.get('/system/migrate', query(['undo']).escape(), SystemController.migrate);

routes.use(catchError);

module.exports = routes;
