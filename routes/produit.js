let express = require('express');
let router = express.Router();
let produitCtrl = require('../controllers/produitCtrl');

router.route('/liste')
    .get(produitCtrl.liste)

router.route('/details/:id_produit')
    .get(produitCtrl.details)
    .post()

module.exports = router;