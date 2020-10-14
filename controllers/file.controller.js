const multer = require('multer');
const shortId = require('shortid');
const fs = require('fs');

module.exports = {
    uploadFile: (req, res, next) => {

        const configMulter = {
            limits: {
                // Lo usuarios autenticados pueden subir archivos de mayor tamaño
                fileSize: req.user ? 1024 * 1024 * 10 : 1024 * 1024,
            },
            storage: fileStorage = multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, __dirname + '/../uploads');
                },
                filename: (req, file, cb) => {
                    const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                    cb(null, `${shortId.generate()}.${extension}`.trim())
                },
            })
        }

        const upload = multer(configMulter).single('file');

        upload(req, res, async error => {
            console.log(req.file);
            if (!error) {
                return res.status(200).json({ file: req.file.filename });
            } else {
                console.log(error);
                return next();
            }
        })
    },

    deleteFile: async (req, res, next) => {
        const { filename } = req;

        try {
            fs.unlinkSync(__dirname+`/../uploads/${filename}`);
            return res.status(200).json({ msg: `El archivo ${filename} se ha eliminado correctamente`});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: 'No se ha podido eliminar el archivo' });
        }
    }
}