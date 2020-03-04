let express = require('express');
let router = express.Router();
let produitCtrl = require('../controllers/produitCtrl');
let usersMdlw = require('../middlewares/usersMdlw');
let connection = require('../config/db');

router.use(usersMdlw.is_connected_for_navbar);
router.use(usersMdlw.type_user)

router.route('/liste')
    .get(produitCtrl.liste)

router.route('/details/:id_produit')
    .get(produitCtrl.details)

router.route('/update_dispo')
    .put(produitCtrl.produit_update_dispo)

router.route('/update/:id')
    .get(produitCtrl.update_get)
    .put(produitCtrl.update_put)

module.exports = router;