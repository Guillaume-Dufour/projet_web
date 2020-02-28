let express = require('express');
let router = express.Router();
let produitCtrl = require('../controllers/produitCtrl');
let connection = require('../config/db');

router.route('/liste')
    .get(produitCtrl.liste)

router.route('/details/:id_produit')
    .get(produitCtrl.details)

module.exports = router;