const knex = require('../factories/knex-factory');

exports.criarTabela = async (sqlTabela, nomeTabela) => {
    try {
        console.log(88, sqlTabela);
        await knex.raw(sqlTabela);
        console.log(`Tabela ${nomeTabela} criada com sucesso ou já existente!`);
    } catch (error) {
        console.error(`Erro ao criar tabela: ${nomeTabela}`, error);
    }
}

exports.removePropriedadesNulas = objeto => {
    for (let chave in objeto) {
        if (objeto[chave] === null || objeto[chave] === undefined) {
            delete objeto[chave];
        }
    }
    return objeto;
}

exports.gerarSqlTabelaHistoricoAlteracoes = () => {
    const sql = `
    BEGIN;
    CREATE TABLE IF NOT EXISTS historicos_alteracoes (
        id SERIAL PRIMARY KEY,
        nome_tabela VARCHAR(100) NOT NULL,
        id_registro_principal INT NOT NULL,
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tipo_alteracao VARCHAR(20) NOT NULL
    );
    COMMIT;
    `;
    return sql;
}
