const path = require('path')
let multer = require('multer');
let multerGoogleStorage = require('multer-google-storage');

let uploadHandler = multer({
    limits: { fileSize: 1024*1024 },
    storage: multerGoogleStorage.storageEngine({
        keyFilename: path.join(__dirname, '/keys.json'),
        projectId: 'gleaming-realm-270117',
        bucket: 'projet_web_charcuterie_dufour_guillaume',
    })
});

module.exports = uploadHandler;