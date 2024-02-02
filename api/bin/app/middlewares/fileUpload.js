const path = require('path');
const multer = require('multer');
const { v4 } = require('uuid');

module.exports = {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname,'..', '..', '..', 'storage', 'files'),
        filename: (req, file, cd) => {
            const name = v4();
            const ext = path.extname(file.originalname);

            cd(null, `${name}.${ext}`);
        }
    }),
};
