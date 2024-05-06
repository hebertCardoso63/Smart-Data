const knex = require('../factories/knex-factory');
const { attachPaginate } = require('knex-paginate');

attachPaginate(knex);

exports.obterTodasTabelas = async () => {
    const tabelas = await knex.raw(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name NOT IN ('historicos_alteracoes')
    `)

    console.log(2525, tabelas);

    const { rows } = tabelas;

    return rows;
} 

exports.inserirHistoricoAlteracao = async dadosHistorico => {
    const insert = await knex({ ha: 'historicos_alteracoes'})
        .insert(dadosHistorico);

    if (!insert) {
        return false;
    }

    return insert;
}
exports.obterHistoricoAlteracao = async nomeTabela => {
    const query = await knex({ tb: 'historicos_alteracoes' })
        .select(['*'])
        .where('tb.nome_tabela', nomeTabela)
        .orderBy('tb.id', 'desc');

    return query; 
}

exports.obterRegistrosTabela = async (nomeTabela, filtro) => {
    let query = knex({ tb: nomeTabela })
       .select(['*'])
       .whereNull('tb.data_exclusao');

    try {
        const [objExemplo] = await query;
        const atributosTabelaArray = Object.keys(objExemplo);

        if (filtro && filtro.atributos_tabela) {
            query = query.where((builder) => {
                atributosTabelaArray.forEach(atributo => {
                    if (filtro.atributos_tabela[atributo]) {
                        builder.andWhere('tb.' + atributo, 'like', `%${filtro.atributos_tabela[atributo]}%`);
                    }
                });
            });
        }

        if (filtro && filtro.paginacao) {
            query = query.paginate(filtro.paginacao);
        }

        return query;
    } catch (error) {
        console.error('Erro ao obter dados da tabela:', error);
        return [];
    }
};

exports.adicionarRegistro = async (nomeTabela, dadosRegistro) => {
    const [insert] = await knex.insert(dadosRegistro, ['id'])
       .into(nomeTabela);

    if (!insert) {
        return false;
    }

    return insert;
};

exports.editarRegistro = async (nomeTabela, registroId, dadosRegistro) => {
    const [registro] = await knex({ tb: nomeTabela })
        .where('tb.id', registroId)
        .update(dadosRegistro, ['id']);

    if (!registro) {
        return false
    }

    return registro;
};