const multer = require('multer');
const { uploadFile, downloadFile } = require('../controllers/file');

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

module.exports = app => {
    app.route('/upload-file')
        .post(
            upload.single('file'),
            uploadFile
        );
    app.route('/tabelas/:nome_tabela/donwload-file')
        .get(
            downloadFile
        );
}

