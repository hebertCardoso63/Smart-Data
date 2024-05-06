const ExcelJS = require('exceljs');

exports.gerarCSV = async dados => {
    // Crie uma nova planilha Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('CSV');

    // Adicione os cabeçalhos das colunas
    const headers = Object.keys(dados[0]);
    worksheet.addRow(headers);

    // Adicione os dados ao worksheet
    dados.forEach(obj => {
        const row = Object.values(obj);
        worksheet.addRow(row);
    });

    // Escreva o arquivo CSV em um buffer
    const csvBuffer = await workbook.csv.writeBuffer();
    
    return {
        buffer: csvBuffer,
    };
};

