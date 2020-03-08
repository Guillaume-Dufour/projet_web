var mysql = require('mysql');

/*var connexion = mysql.createPool({
    database: 'projet_web',
    host: 'localhost',
    user: 'root',
    password: ''
});*/

var connexion = mysql.createPool(process.env.CLEARDB_DATABASE_URL);

connexion.getConnection(function (err) {
    if (err)
        throw err;

    console.log("Connexion effectuée");
});

module.exports = connexion;