const { matchedData } = require('express-validator');
const Yup = require('yup');

const Users = require('../models/Users');

class UsersController {
    async show(req, res, next) {
        // Verificando se o campo "id" e o campo "login" são válidos
        const data = matchedData(req);
        const schema = Yup.object().shape({
            id: Yup.number().integer(),
            login: Yup.string().min(3),
        });

        for (const key of Object.keys(data)) {
            if (data[key] === '') {
                data[key] = undefined;
            }
        }

        try {
            await schema.validate(data);
        } catch (err) {
            return res.status(400).json({
                message: err.errors,
                code: 400,
            });
        }

        // Verificando se os campos "id" e "login" seguem preenchidos ao mesmo tempo
        if (data.id && data.login) {
            return res.status(400).json({
                message: "Somente um campo preechido por vez. Preencha o campo 'id' ou o campo 'login'",
                code: 400,
            });
        }

        // Verificando se não há campos preechidos
        // if (!data.id && !data.login) {
        //     return res.status(400).json({
        //         message: "Necessário o campo 'id' ou 'login' estar preenchido",
        //         code: 400,
        //     });
        // }

        let user;
        // Buscando pelos dados a partir do "id"
        if (data.id) {
            try {
                user = await Users.findByPk(data.id);

                if (!user) {
                    return res.status(404).json({
                        message: 'Usuário não localizado',
                        code: 404,
                    });
                }
            } catch (err) {
                return next(err);
            }
        }

        // Buscando pelos dados a partir do "login"
        if (data.login) {
            try {
                user = await Users.findOne({
                    where: {
                        login: data.login,
                    },
                });
                
                if (!user) {
                    return res.status(404).json({
                        message: 'Usuário não localizado',
                        code: 404,
                    });
                }
            } catch (err) {
                return next(err);
            }
        }

        if (!user) {
            user = [];
        }

        return res.status(200).json({
            user,
            code: 200,
        });
    }

    // async index(req, res, next) {
    //     // Obtendo os usuários
    //     let users;
    //     try {
    //         users = await Users.findAll();

    //         if (!users) {
    //             users = [];
    //         }

    //         return res.status(200).json({
    //             users,
    //             code: 200,
    //         });
    //     } catch (err) {
    //         return next(err);
    //     }
    // }
}

module.exports = new UsersController();
