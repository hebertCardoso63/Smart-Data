// index.js
const express = require("express");
const load = require("express-load");
const cors = require("cors");
const {
  gerarSqlTabelaHistoricoAlteracoes,
  criarTabela,
} = require("./app/helpers/utils");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(cors({ credentials: false }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

load("controllers", { cwd: "app" }).then("routes").into(app);

async function inicializar() {
    const historicosAlteracoes = gerarSqlTabelaHistoricoAlteracoes();

    try {
        await criarTabela(historicosAlteracoes, "historicos_alteracoes");
    } catch (error) {
        console.error("Erro ao criar tabelas:", error);
        process.exit(1); // Encerrar o processo em caso de erro na criação das tabelas
    }

    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
}

inicializar();
