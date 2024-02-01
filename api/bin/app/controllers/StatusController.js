const { matchedData } = require('express-validator');
const Yup = require('yup');

const Status = require('../models/Status');

class StatusController {

    // Obter um unico status a partir de seus status
    async show(req, res, next) {
        // Verificando se o "req" possui o campo "id" e se é válido
        const data = matchedData(req);
        const schema = Yup.object().shape({
            id: Yup.number().integer().required(),
        });

        try {
            await schema.validate(data);
        } catch (err) {
            return res.status(400).json({
                message: err.errors,
                code: 400,
            });
        }

        // Buscando o status pelo id informado
        let status;
        try {
            status = await Status.findByPk(data.id, {
                attributes: ['id', 'name'],
            });
        } catch (err) {
            return next(err);
        }

        if (!status) {
            return res.status(403).json({
                message: 'Status não localizado',
                code: 403,
            });
        }

        return res.status(200).json({
            status,
            code: 200,
        });
    }

    // Obter todos os status cadastrados
    async index(req, res, next) {
        // Tentando obter todos os status cadastrados
        try {
            const status = await Status.findAll({
                attributes: ['id', 'name'],
            });

            return res.status(200).json({
                status,
                code: 200,
            });
        } catch (err) {
            return next(err);
        }
    }

    // Criar novos status
    async store(req, res, next) {
        // Verificando se o "req" possui os campo "name" ou "names" e se são válidos
        const data = matchedData(req);
        const schema = Yup.object().shape({
            name: Yup.string(),
            names: Yup.array(), // Essa funcção poderá receber dois parametros, que são: Um unico nome ou uma lista de nomes para criar itens
        });

        try {
            await schema.validate(data);
        } catch (err) {
            return res.status(400).json({
                message: err.errors,
                code: 400,
            });
        }

        // Verificando se os dois campos estão presentes
        if (data.name && data.names) {
            return res.status(400).json({
                message: "Somente um campo preechido por vez. Preencha o campo 'name' ou o campo 'names'",
                code: 400,
            });
        }

        // Verificando se há campos preenchidos
        if (!data.name && !data.names) {
            return res.status(400).json({
                message: "Necessário o campo 'name' ou 'names' estar preenchido",
                code: 400,
            });
        }

        // Função responsável pela criação de itens
        const itemCreate = async (name) => {
            const status = await Status.findOne({
                where: {
                    name,
                },
            });

            if (status) {
                return {
                    status: false,
                    name,
                }
            } else {
                const { id } = await Status.create({
                    name,
                });

                return {
                    status: true,
                    id,
                }
            }
        }

        // Criando os itens com base no array 'names'
        if (data.names) {
            const exist = [];
            const created = [];
            for (const index in data.names) {
                const item = await itemCreate(data.names[index]);
                if (!item.status) {
                    exist.push(item.name);
                } else {
                    created.push({
                        id: item.id,
                        name: data.names[index],
                    })
                }
            }

            return res.status(201).json({
                itens_criados: created,
                itens_nao_criados: exist,
            });
        }

        // Criadn um item de acordo com o valor 'name'
        if (data.name) {
            const item = await itemCreate(data.name);
            if (!item.status) {
                return res.status(409).json({
                    message: ` Nome '${data.name}' em uso`,
                    code: 409,
                });
            } else {
                return res.status(201).json({
                    item,
                    code: 201,
                });
            }

        }

        return res.status(201).json({
            message: true,
            code: 201,
        });
    }
}

module.exports = new StatusController();