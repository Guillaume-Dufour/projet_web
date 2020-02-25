var express = require('express');
var bodyParser = require('body-parser');
var apiRoueter = require('./apiRouter');
var userRouter = require('./routes/usersCtrl');
let expressSanitizer = require('express-sanitizer');
let cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var cookie_perso = require('./models/cookie');

var app = express();

app.use('/public', express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(expressSanitizer());
app.use(cookieParser());

app.set('view engine', 'ejs');

//app.use(require('./routes'));

app.use('/users', userRouter);

/*app.get('/', function (req, res) {
    res.render('connexion');
});*/

app.get('/', function (req, res) {
    res.render('accueil')
})

app.get('/guillaume', function (req, res) {
    var decoded = jwt.verify(cookie_perso.getToken(req), cookie_perso.key());
    res.send(""+decoded.id_utilisateur);
})

app.get('*', function (req, res) {
    res.status(404).send('Erreur');
});

/*app.post('/', function (req, res) {
    res.send("Bonjour "+req.body.nom);

});*/

app.listen(8080);