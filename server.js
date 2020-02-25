var express = require('express');
var bodyParser = require('body-parser');
var userRouter = require('./routes/users');
let expressSanitizer = require('express-sanitizer');
let cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var cookie_perso = require('./models/cookie');
var util = require('./models/utilisateur');

var app = express();

app.use('/public', express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(expressSanitizer());
app.use(cookieParser());

app.set('view engine', 'ejs');

app.use('/users', userRouter);

app.get('/', function (req, res) {
    res.render('accueil')
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