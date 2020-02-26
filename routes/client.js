let express = require('express');
let router = express.Router();

router.route('/homepage')
    .get(function (req, res) {
        res.send("salut");
    })

router.route('/commandes')
    .get(function (req, res) {

    })

module.exports = router;