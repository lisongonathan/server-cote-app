const Controller = require('./Controller')
const UserModel = require('../models/UserModel')

class DashboardController extends Controller {
    constructor () {
        super();
        this.Model = new UserModel()
    }

    async hello(req, res) {
        const etudiants = await this.dashboardModel.listEtudiants();
        await console.log(etudiants)        
        // if (!etudiants) return this.sendError(res, 'Not found', 'Aucune ligne trouvée', 404);
        // this.sendSuccess(res, etudiants, 'Liste des années académiques');
       
    }

}

module.exports = new DashboardController();