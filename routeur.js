var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.send("Bienvenue sur la page d'accueil");
});

router.get('/about', function (req, res) {
    res.send("Vous êtes sur la section about");

});