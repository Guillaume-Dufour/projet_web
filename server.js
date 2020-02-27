var express = require('express');
var bodyParser = require('body-parser');
var userRouter = require('./routes/users');
var clientRouter = require('./routes/client');
let produitRouter = require('./routes/produit')
let expressSanitizer = require('express-sanitizer');
let cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var cookie_perso = require('./models/token');
var util = require('./models/utilisateur');

var app = express();

app.use('/public', express.static(__dirname + '/public'));
//app.use('/photo_produit', express.static(__dirname + '/public/images/produits'))

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(expressSanitizer());
app.use(cookieParser());

app.set('view engine', 'ejs');

app.use('/users', userRouter);
app.use('/users/client', clientRouter);
app.use('/produits', produitRouter);


app.get('/', function (req, res) {
    let estConnecte = (req.cookies['secretToken'] ? 1 : 0);
    res.render('accueil', {estConnecte: estConnecte});
})

app.get('/guillaume', function (req, res) {
    var decoded = jwt.verify(cookie_perso.getToken(req), cookie_perso.key());
    util.getUserById(decoded.id_utilisateur, function (result) {
        var name = result.prenom_utilisateur;
        res.send(name)
    });
})

app.get('*', function (req, res) {
    res.status(404).send('Erreur');
});

app.listen(8080);