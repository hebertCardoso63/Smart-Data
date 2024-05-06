const fastcsv = require('fast-csv');
const service = require('../services/file');
const serviceTable = require('../services/table');
const { criarTabela } = require('../helpers/utils');
const knex = require('../factories/knex-factory');

exports.downloadFile = async (request, response) => {
    const {
        params: {
            nome_tabela: nomeTabela,
        },
        query: {
            filtro = null,
        },
    } = request; 

    let filtroJson = null;

    if (filtro) {
        filtroJson = JSON.parse(filtro);
    }

    const dados = await serviceTable.obterRegistrosTabela(nomeTabela, filtroJson)


    return service.gerarCSV(dados)
        .then(result => {
            const headerConfig = {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="dados.csv"'
            };

            // Defina os cabeçalhos da resposta
            response.writeHead(200, headerConfig);

            // Envie o buffer como resposta
            response.write(result.buffer);
            response.status(200).end();
        })
        .catch(error => {
            console.error('Erro ao gerar o CSV:', error);
            response.statusCode = 500;
            response.end('Erro interno do servidor');
        });
}

exports.uploadFile = async (request, response) => {
    const { file } = request;

    if (!file) {
        return response.status(400).json({ mensagem: 'Arquivo não encontrado!' });
    }

    try {
        const csvJson = await parseCsv(file);

        const csvFormatado = formatarChaves(csvJson);

        const dadosTabela = gerarSqlTabela(csvFormatado[0], file.originalname);

        await criarTabela(dadosTabela.sql, dadosTabela.nome);

        await inserirDados(csvFormatado, dadosTabela.nome);

        return response.status(200).json({ mensagem: 'Dados inseridos' });
    } catch (err) {
        return response.status(400).json({ mensagem: err.message });
    }
}

const formatarChaves = objetos => {
    const palavrasReservadas = ['group', 'order']; // Adicione aqui outras palavras reservadas, se necessário
    const objetosFormatados = objetos.map(objeto => {
        const novoObjeto = {};
        for (const chave in objeto) {
            if (Object.hasOwnProperty.call(objeto, chave)) {
                let chaveFormatada = chave
                    .toLowerCase() // Transforma em minúsculas
                    .replace(/\s+/g, '_') // Substitui espaços por _
                    .replace(/\//g, '_') // Substitui / por _
                    .replace(/[^\w\s]/g, '') // Remove caracteres especiais
                    .replace(/([a-z])([A-Z])/g, '$1_$2') // Insere _ entre letras minúsculas e maiúsculas
                    .replace(/(\D)(\d)/g, '$1_$2'); // Insere _ entre letras e números
                
                // Se a chave formatada estiver na lista de palavras reservadas, coloque-a entre aspas duplas
                if (palavrasReservadas.includes(chaveFormatada)) {
                    chaveFormatada = `${chaveFormatada}`;
                }
                
                novoObjeto[chaveFormatada] = objeto[chave];
            }
        }
        return novoObjeto;
    });
    return objetosFormatados;
};

const formatarChavesParaMinusculas = arrayDeObjetos => {
    // Mapeia cada objeto no array
    return arrayDeObjetos.map(objeto => {
        const novoObjeto = {};
        // Para cada chave do objeto, formata para minúsculas
        for (const chave in objeto) {
            if (Object.hasOwnProperty.call(objeto, chave)) {
                // Converte a chave para minúsculas
                const chaveFormatada = chave.toLowerCase();
                // Adiciona a chave formatada ao novo objeto
                novoObjeto[chaveFormatada] = objeto[chave];
            }
        }
        return novoObjeto;
    });
}

const formatarNomeTabela = str => {
    // Substitui hífens por underscores
    const stringSnakeCase = str.replace(/-/g, '_');
    // Remove os últimos 4 caracteres da string
    return stringSnakeCase.slice(0, -4);
}

const dividirArrayEmPartesBalanceadas = (array, maxRowsPerInsert = 1000) => {
    const partes = [];
    let inicio = 0;

    // Calcula o número de partes baseado no limite máximo por inserção
    while (inicio < array.length) {
        partes.push(array.slice(inicio, inicio + maxRowsPerInsert));
        inicio += maxRowsPerInsert;
    }

    return partes;
}


const inserirDados = async (dados, nomeTabela) => {
    const dadosFormatados = formatarChavesParaMinusculas(dados);
    const partes = dividirArrayEmPartesBalanceadas(dadosFormatados);

    try {
        await knex.transaction(async trx => {
            const arrayPromisesInsert = partes.map(parte => trx.insert(parte).into(nomeTabela));
            return await Promise.all(arrayPromisesInsert);
        });
        console.log('Inserção concluída com sucesso');
    } catch (e) {
        console.error('Erro durante a inserção:', e);
    }
}


const isReservedWord = (word) => {
    const reservedWords = ['TABLE', 'SELECT', 'INSERT', 'DELETE', 'WHERE', 'GROUP']; // Exemplo simplificado
    return reservedWords.includes(word.toLowerCase());
};

const gerarSqlTabela = (obj, nomeArquivo) => {
    const nomeTabela = formatarNomeTabela(nomeArquivo); 

    let columns = '"id" SERIAL PRIMARY KEY, ';

    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key) && key.trim() !== "") { // Verifica se a chave não está vazia
            const columnName = isReservedWord(key) ? `"${key}"` : `"${key}"`;
            columns += `${columnName} TEXT, `;
        }
    }

    // Remove a última vírgula antes de adicionar as colunas de data
    columns = columns.slice(0, -2) + ', ';

    // Adiciona as colunas de data e usuário
    columns += `"data_criacao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `;
    columns += `"data_atualizacao" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, `;
    columns += `"data_exclusao" TIMESTAMP`;

    const sql = `CREATE TABLE IF NOT EXISTS "${nomeTabela}" (${columns});`;

    const dadosTabela = {
        nome: nomeTabela,
        sql,
    };

    return dadosTabela;
}



const parseCsv = async file => {
    return new Promise((resolve, reject) => {
        const csvData = [];
        const parser = fastcsv.parse({ headers: true })
            .on('data', (row) => {
                csvData.push(row);
            })
            .on('end', () => {
                resolve(csvData);
            })
            .on('error', (error) => {
                reject({ message: error.message });
            });
        
        parser.write(file.buffer);
        parser.end();
    });
}
