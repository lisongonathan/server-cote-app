const Model = require('./Model');

class UserModel extends Model {
    constructor() {
        super();
    }

    async findUserByLogin(matricule, phone) {
        this.sql = `SELECT agent.*, administratif_agent.diplome, administratif_agent.niveau, ville.nomVille AS 'ville', origine_agent.id_ville
            FROM agent
            INNER JOIN administratif_agent ON administratif_agent.id_agent = agent.id
            INNER JOIN origine_agent ON origine_agent.id_agent = agent.id
            INNER JOIN ville ON ville.id = origine_agent.id_ville
            WHERE matricule = ? AND telephone = ?`;
        this.params = [matricule, phone]

        const results = await this.query(this.sql, this.params);

        return results[0];
    }

    async findModuleByLogin(matricule, phone, poste) {
        this.sql = `SELECT agent.*, administratif_agent.diplome, administratif_agent.niveau, ville.nomVille AS 'ville', origine_agent.id_ville
            FROM agent
            INNER JOIN administratif_agent ON administratif_agent.id_agent = agent.id
            INNER JOIN origine_agent ON origine_agent.id_agent = agent.id
            INNER JOIN ville ON ville.id = origine_agent.id_ville
            INNER JOIN affectation ON affectation.id_agent = agent.id
            WHERE matricule = ? AND telephone = ? AND affectation.id_poste = ?`;
        this.params = [matricule, phone, poste]

        const results = await this.query(this.sql, this.params);

        return results[0];
    }
    
    async findAllYears() {
        this.sql = `SELECT *
                    FROM annee`;

        const results = await this.query(this.sql);

        return results;
    }
    
    async findAllEtudiants() {
        this.sql = `SELECT *
                    FROM etudiant`;

        const results = await this.query(this.sql);

        return results;
    }
    
    async findAllLogs(annee) {
        this.sql = `SELECT fiche_cotation.id_etudiant, CONCAT(etudiant.nom, ' ', etudiant.post_nom, ' ', etudiant.prenom) AS 'etudiant', etudiant.avatar,  etudiant.matricule, CONCAT(niveau.intitule, ' ', section.designation, ' ', promotion.orientation, ' ', niveau.systeme) AS 'classe', COUNT(insertion.id) AS 'notif'
                    FROM etudiant
                    INNER JOIN fiche_cotation ON fiche_cotation.id_etudiant = etudiant.id
                    INNER JOIN insertion ON insertion.id_fiche_cotation = fiche_cotation.id
                    INNER JOIN matiere ON matiere.id = fiche_cotation.id_matiere
                    INNER JOIN unite ON unite.id = matiere.id_unite
                    INNER JOIN promotion ON promotion.id = unite.id_promotion
                    INNER JOIN niveau ON niveau.id = promotion.id_niveau
                    INNER JOIN section ON section.id = promotion.id_section
                    WHERE fiche_cotation.id_annee = ?
                    GROUP BY etudiant.id`;

        const results = await this.query(this.sql, [annee]);

        return results;
    }
    
    async findAllInsetion(id) {
        this.sql = `SELECT insertion.id, CONCAT(matiere.designation, ' (', matiere.statut, ')') AS 'cours', CONCAT('Credit : ', matiere.credit) AS 'credit', CONCAT(agent.nom, ' ', agent.post_nom) AS 'jury', agent.avatar, insertion.cote, fiche_cotation.tp, fiche_cotation.td, fiche_cotation.examen, fiche_cotation.examen, insertion.date_insert, insertion.last_val, insertion.description
                    FROM insertion
                    INNER JOIN agent ON agent.id = insertion.id_agent
                    INNER JOIN fiche_cotation ON fiche_cotation.id = insertion.id_fiche_cotation
                    INNER JOIN matiere ON matiere.id = fiche_cotation.id_matiere
                    WHERE fiche_cotation.id_etudiant = ?`;

        const results = await this.query(this.sql, [id]);

        return results;
    }


}

module.exports = UserModel;