let express = require('express');
let router = express.Router();

router.route('/homepage')
    .get(function (req, res) {
        res.send("salut");
    })

module.exports = router;