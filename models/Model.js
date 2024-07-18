const db = require('../config/database');

class Model {
    constructor() {
        if (Model.instance == null) {
            Model.instance = this;
        }
        return Model.instance;
    }

    async query(sql, params = []) {
        return new Promise((resolve, reject) => {
            db.query(sql, params, (err, results) => {
                if(err) return reject(err);

                resolve(results);
            });
        });
    }

    async getLastInsertId() {
        const results = await this.query('SELECT LAST_INSERT_ID() as id');
        return results[0].id
    }

    //Autres méthodes communes
}

module.exports = Model;