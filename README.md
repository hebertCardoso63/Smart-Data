# Smart Data

## Funcionalidades

- Upload de arquivo CSV
- Listar Registros de uma tabela
- Filtrar registros de uma tabela
- Adicionar novos registros na tabela
- Editar registros na tabela
- Exportar dados da tabela no formato CSV
- Listagem do histórico de alterações de uma tabela

## Ferramentas e versões:

docker: v25.0.3

nodeJs: v18.15.0

nodemon: v3.1.0

express: v4.19.2

fast-csv: v5.0.1

multer: v1.4.5-lts.1

knex: v3.1.0

exceljs: v4.4.0

reactJs: v18.3.1

antd: v5.16.5

axios: v1.6.8

## Estrutura/Construção

A aplicação é dividida em duas partes, o servidor e o cliente. Para criar uma nova instância do banco de dados Postgres, foi utilizado o docker, o servidor possui uma API utilizando Node.Js e Express.Js com as rotas necessárias para o cliente. As querys foram feitas com o query builder Knex.Js. O cliente foi desenvolvido com React.Js e utiliza componentes do AntDesign.

## Como rodar

### Banco de dados
Abra um novo terminal no diretório `./servidor` e use o comando:

 `$docker-compose up` 
 
ou crie uma instância do postgres como preferir (é necessário utilizar as credenciais que estão em `./docker-compose.yaml`).
Para usar o docker-compose é preciso o ter instalado em sua máquina, veja em: https://docs.docker.com/compose/

## Servidor
No diretório raiz do servidor (`./servidor`) utilize os seguintes comandos:

`$npm install`

`$npm start`

## Cliente
No diretório raiz do cliente (`./cliente`) utilize os comandos:

`$npm install`

`$npm start`


## Arquivos CSV
Dentro da pasta datasets há alguns arquivos CSVs baixados de alguns sites que podem ser utilizados para upload na aplicação.

## Collection postman
Dentro da pasta docs existe um arquivo .json que é a collection do projeto exportada do postman. (caso queira usar)
