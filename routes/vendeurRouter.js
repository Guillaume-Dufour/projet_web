let express = require('express');
let router = express.Router();
let vendeurCtrl = require('../controllers/vendeurCtrl');
let produitCtrl = require('../controllers/produitCtrl');
let usersMdlw = require('../middlewares/usersMdlw');

router.use(usersMdlw.is_connected_for_navbar);
router.use(usersMdlw.is_vendeur);

router.route('/homepage')
    .get(vendeurCtrl.homepage)

router.route('/profil')
    .get(vendeurCtrl.profil)

router.route('/profil_modify')
    .get(vendeurCtrl.profil_modify_get)

router.route('/infos_clients')
    .get(vendeurCtrl.clients_list)

router.route('/produit_create')
    .get(produitCtrl.produit_create_get)
    .post(produitCtrl.produit_create_post)

router.route('/produit_update/:id')
    .get(produitCtrl.update_get)
    .put(produitCtrl.update_put)

router.route('/produit_manage')
    .get(vendeurCtrl.produit_manage_get)

router.route('/commande_search')
    .get(vendeurCtrl.commande_search_get)
    .post(vendeurCtrl.commande_search_post)
    .put(vendeurCtrl.commande_put)

router.route('/commandes_search/:id_commande')
    .get(vendeurCtrl.commande_details)

router.route('/commandes_client/:id')
    .get(vendeurCtrl.commandes_list)

router.route('/stats')
    .get(vendeurCtrl.stats)

module.exports = router;