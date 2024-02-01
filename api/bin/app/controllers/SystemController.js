const { exec } = require('child_process');
const { matchedData } = require('express-validator');

class SystemController {
    async migrate(req, res, next) {
        const data = matchedData(req);
        let undo = '';
        if (data.undo === "true") {
            undo = ':undo:all';
        }
        exec(`npx sequelize db:migrate${undo}`, (err, stdout, stderr) => {
            if (err){
                return res.status(500).json({
                    message: 'ERRO INTERNO',
                    error: err,
                    code: 500,
                });
            }
            if (stderr) {                
                return res.status(500).json({
                    message: 'ERRO INTERNO',
                    error: err,
                    code: 500,
                });
            }

            return res.status(200).json(stdout);
        });
    }
}

module.exports = new SystemController();