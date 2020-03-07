let multer = require('multer');
let multerGoogleStorage = require('multer-google-storage');

let uploadHandler = multer({
    storage: multerGoogleStorage.storageEngine({
        keyFilename: 'keys.json',
        projectId: 'gleaming-realm-270117',
        bucket: 'projet_web_charcuterie_dufour_guillaume',
    }),
});

module.exports = uploadHandler;