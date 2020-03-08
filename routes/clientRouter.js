let express = require('express');
let router = express.Router();
let clientCtrl = require('../controllers/clientCtrl');
let userCtrl = require('../controllers/userCtrl');
let usersMdlw = require('../middlewares/usersMdlw');

router.use(usersMdlw.is_connected_for_navbar);
router.use(usersMdlw.is_client);


router.route('/homepage')
    .get(clientCtrl.homepage)

router.route('/profil')
    .get(clientCtrl.profil)
    .put(userCtrl.delete_profil)

router.route('/profil_modify')
    .get(clientCtrl.profil_modify_get)

router.route('/commandes')
    .get(clientCtrl.commandes_list)

router.route('/commandes/:id_commande')
    .get(usersMdlw.verif_commande_user, clientCtrl.commande_details)

router.route('/panier')
    .get(clientCtrl.panier)
    .post(clientCtrl.valid_commande)
    .delete(clientCtrl.delete_panier);

router.route('/add_panier')
    .post(clientCtrl.add_panier)

router.route('/add_produit_favori')
    .post(clientCtrl.add_produit_favori)

router.route('/produits_favoris')
    .get(clientCtrl.produits_favoris)
    .delete(clientCtrl.delete_produit_favori)

module.exports = router;