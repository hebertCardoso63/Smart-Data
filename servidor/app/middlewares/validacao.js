const Joi = require('joi');

// Define a schema para validação do usuário
const validarDadosTabela = {
    body: Joi.object().keys({
        year: Joi.string().required(),
        industry_aggregation_nzsioc: Joi.string().required(),
        industry_code_nzsioc: Joi.string().required(),
        industry_name_nzsioc: Joi.string().required(),
        units: Joi.string().required(),
        variable_code: Joi.string().required(),
        variable_name: Joi.string().required(),
        variable_category: Joi.string().required(),
        value: Joi.string().required(),
        industry_code_anzsic06: Joi.string().required(),
    }),
};
exports.validarDadosTabela = validarDadosTabela;

