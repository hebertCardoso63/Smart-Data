const { removePropriedadesNulas } = require('../helpers/utils');
const service = require('../services/table');


exports.obterTodasTabelas = async (_, response) => {
    const tabelas = await service.obterTodasTabelas();

    if (tabelas.length === 0) {
        return response.status(204).json();
    }

    return response.status(200).json(tabelas);
};
exports.obterHistoricoAlteracao = async (request, response) => {
    const {
        query: {
            nome_tabela: nomeTabela,
        },
    } = request;
    const historico = await service.obterHistoricoAlteracao(nomeTabela);

    if (historico.length === 0) {
        return response.status(204).json({ mensagem: 'Dados não encontrados.' });
    }

    return response.status(200).json(historico);
};
exports.obterRegistrosTabela = async (request, response) => {
    const {
        params: {
            nome_tabela: nomeTabela,
        },
        query: {
            filtro = null,
        },
    } = request;

    console.log(request.query);
    console.log(request.params);

    console.log(666, filtro);

    let filtroJson = null;

    if (filtro) {
        filtroJson = JSON.parse(filtro)
    }

    const dadosTabela = await service.obterRegistrosTabela(nomeTabela, filtroJson);

    console.log(777, dadosTabela);

    if (dadosTabela.length === 0) {
        return response.status(400).json({ mensagem: 'Dados não encontrados.' });
    }

    return response.status(200).json(dadosTabela);
};

exports.adicionarRegistro = async (request, response) => {
    const {
        params: {
            nome_tabela: nomeTabela,
        },
        body: dadosRegistro,
    } = request;

    const dadosValidosTabela = removePropriedadesNulas(dadosRegistro);

    const { id } = await service.adicionarRegistro(nomeTabela, dadosValidosTabela);

    if (!id) {
        return response.status(400).json({ mensagem: 'Erro ao adicionar registro.'});
    }

    const dadosHistorico = {
        nome_tabela: nomeTabela,
        id_registro_principal: id,
        tipo_alteracao: 'ADICAO',
    }
    
    const insertHistoricoAlteracao = await service.inserirHistoricoAlteracao(dadosHistorico);

    if (!insertHistoricoAlteracao) {
        return response.status(400).json({ mensagem: 'Erro ao adicionar historico de alteração.'});
    }

    return response.status(200).json({ mensagem: 'Registro inserido com sucesso.'});
};

exports.editarRegistro = async (request, response) => {
    const {
        params: {
            nome_tabela: nomeTabela,
            registro_id: registroId,
        },
        body: dadosRegistro,
    } = request;

    const dadosValidosRegistro = removePropriedadesNulas(dadosRegistro);

    const { id } = await service.editarRegistro(nomeTabela, registroId, dadosValidosRegistro);

    if (!id) {
        return response.status(400).json({ mensagem: 'Erro ao editar registro.'});
    }

    const dadosHistorico = {
        nome_tabela: nomeTabela,
        id_registro_principal: id,
        tipo_alteracao: 'EDICAO',
    }
    
    const insertHistoricoAlteracao = await service.inserirHistoricoAlteracao(dadosHistorico);

    if (!insertHistoricoAlteracao) {
        return response.status(400).json({ mensagem: 'Erro ao adicionar historico de alteração.'});
    }

    return response.status(200).json({ mensagem: 'Registro editado com sucesso.'});
};