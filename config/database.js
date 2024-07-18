const mysql = require('mysql')

const db = mysql.createConnection({
    host: 'mysql-ista-mbz.alwaysdata.net',
    user: 'ista-mbz',
    password: 'P@sse2mot',
    database: 'ista-mbz_ionos_com'
});

db.connect(err => {
    if (err) {
        console.error('Erreur de connexion : ' + err.stack);
        return;
    }

    console.log('Connecté à la base de données');
});

module.exports = db;