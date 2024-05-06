import axios from "../utils/axiosFactory";
import fileDownload from 'js-file-download';

async function downloadFile(nomeTabela, filtro) {
    // Construa a string de consulta (query string) com base no filtro, se houver
    const queryString = filtro ? `?filtro=${encodeURIComponent(JSON.stringify(filtro))}` : '';

    // Faça a requisição usando a URL com a string de consulta
    const response = await axios.get(`/tabelas/${nomeTabela}/donwload-file${queryString}`, {
        responseType: 'blob' // Importante para manipular a resposta como um Blob
    });
    
    // Aguarde e obtenha os dados da resposta
    const data = response.data;

    // Utiliza a biblioteca js-file-download para baixar o arquivo
    fileDownload(data, `${nomeTabela}.csv`);
}

async function uploadFile(nomeTabela, filtro) {
    // Construa a string de consulta (query string) com base no filtro, se houver
    const queryString = filtro ? `?filtro=${filtro}` : '';

    // Faça a requisição usando a URL com a string de consulta
    const response = await axios.get(`/tabelas/${nomeTabela}/donwload-file${queryString}`);
    
    // Aguarde e obtenha os dados da resposta
    const data = response.data;

    return data;
}

export { downloadFile, uploadFile }