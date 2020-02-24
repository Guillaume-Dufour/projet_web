var express = require('express');
var bodyParser = require('body-parser');
var server = express();

var router = express.Router();


//server.use(bodyParser.urlencoded({ extended: true}));

router.get('/', function (req, res) {
    res.render('connexion');
});

module.exports = router;
server.listen(8080);
