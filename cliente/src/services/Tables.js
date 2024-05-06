import axios from "../utils/axiosFactory";

const headers = {
  "Content-Type": "application/json",
};

async function obterAlteracaoesTabela(nomeTabela) {
    console.log(nomeTabela);
    const params = {
        nome_tabela: nomeTabela,
    };

    // Construa a string de consulta (query string) usando parâmetros
    const queryString = new URLSearchParams(params).toString();

    const response = await axios.get(`/historicos-alteracoes?${queryString}`);
    
    console.log(12, response);
    // Aguarde e obtenha os dados da resposta
    const data = response.data;

    return data;
}

async function obterTodasTabelas() {
    const response = await axios.get(`/tabelas`);

    console.log(771, response);

    if (response.status === 204) {
        return [];
    }

    return response.data;
}

async function obterDadosTabela(nomeTabela, filtro = null) {
    // Construa a string de consulta (query string) com base no filtro, se houver
    const queryString = filtro ? `?filtro=${JSON.stringify(filtro)}` : '';


    // Faça a requisição usando a URL com a string de consulta
    const response = await axios.get(`/tabelas/${nomeTabela}${queryString}`);

    if (response.data.pagination) {
        return response;
    }

    // Aguarde e obtenha os dados da resposta
    return response;
}

async function adicionarRegistroTabela(nomeTabela, dadosRegistro) {
    const response = await axios.post(`/tabelas/${nomeTabela}`, dadosRegistro, { headers });
    
    // Aguarde e obtenha os dados da resposta
    const data = response.data;

    return data;
}

async function editarRegistroTabela(nomeTabela, dadosRegistro) {
    const idInt = parseInt(dadosRegistro.id);
    const response = await axios.patch(`/tabelas/${nomeTabela}/registros/${idInt}`, dadosRegistro, { headers } );
    
    // Aguarde e obtenha os dados da resposta
    const data = await response.data;

    return data;
}

export { obterAlteracaoesTabela, obterDadosTabela, adicionarRegistroTabela, editarRegistroTabela, obterTodasTabelas }