let express = require('express');
let router = express.Router();
let produitCtrl = require('../controllers/produitCtrl');

router.route('/liste')
    .get(produitCtrl.liste)

module.exports = router;