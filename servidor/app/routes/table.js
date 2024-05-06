const {
    editarRegistro,
    adicionarRegistro,
    obterTodasTabelas,
    obterRegistrosTabela,
    obterHistoricoAlteracao,
} = require('../controllers/table');

const { schemaValidation } = require('../middlewares/shema-validator');
const { validarDadosTabela } = require('../middlewares/validacao');

module.exports = app => {
    app.route('/tabelas')
        .get(
            obterTodasTabelas,
        );
    app.route('/tabelas/:nome_tabela')
        .get(
            obterRegistrosTabela
        )
        .post(
            adicionarRegistro
        );

    app.route('/tabelas/:nome_tabela/registros/:registro_id')
        .patch(
            editarRegistro
        );
    app.route('/historicos-alteracoes')
        .get(
            obterHistoricoAlteracao
        );
}