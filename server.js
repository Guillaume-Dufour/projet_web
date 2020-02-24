var express = require('express');
var bodyParser = require('body-parser');
var apiRoueter = require('./apiRouter');
var userRouter = require('./routes/usersCtrl');

var app = express();

app.use('/public', express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

//app.use(require('./routes'));

app.use('/users', userRouter);

/*app.get('/', function (req, res) {
    res.render('connexion');
});*/

app.get('/', function (req, res) {
    res.send("Page d'accueil du site")
})

app.get('*', function (req, res) {
    res.status(404).send('Erreur');
});

/*app.post('/', function (req, res) {
    res.send("Bonjour "+req.body.nom);

});*/

app.listen(8080);