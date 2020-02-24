var mysql = require('mysql');

var connexion = mysql.createConnection({
    database: 'projet_web',
    host: 'localhost',
    user: 'root',
    password: ''
});

connexion.connect(function (err) {
    if (err)
        throw err;

    console.log("Connexion effectuée");
});

module.exports = connexion;