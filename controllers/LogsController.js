const Controller = require('./Controller');
const UserModel = require('../models/UserModel')

class LogsControler extends Controller {
    constructor () {
        super()
        this.Model = new UserModel()
    }

    async getAllLogs(req, res) {
        const { id } = req.body

        const results = await this.Model.findAllLogs(id)               
        if (!results) return this.sendError(res, 'Not found', 'Aucune ligne trouvée', 404);
        this.sendSuccess(res, results, 'Liste des étudiants dont la coté a été inséré');
    }
    
    async getAllInsertions(req, res) {
        const { id } = req.body

        const results = await this.Model.findAllInsetion(id)               
        if (!results) return this.sendError(res, 'Not found', 'Aucune ligne trouvée', 404);
        this.sendSuccess(res, results, 'Liste des insetions');

    }


}

module.exports = new LogsControler();