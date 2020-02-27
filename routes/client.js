let express = require('express');
let router = express.Router();
let clientCtrl = require('../controllers/clientCtrl');



router.route('/homepage')
    .get(function (req, res) {
        res.send("salut");
    })

router.route('/commandes')
    .get(clientCtrl.commandes_list)

module.exports = router;