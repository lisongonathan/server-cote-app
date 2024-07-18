const Controller = require('./Controller');
const UserModel = require('../models/UserModel');

class UserController extends Controller {
    constructor () {
        super();
        this.userModel = new UserModel();
    }

    async authentication(req, res) {
        const { pseudo, passwd, module } = req.body;

        try {

            switch (module) {
                case 2:
                    //MODULE TITULAIRE
                    const titulaire = await this.userModel.findUserByLogin(pseudo, passwd);
                    
                    if (!titulaire) return this.sendError(res, 'Not found', 'Verifiez vos informations', 404);
                    this.sendSuccess(res, titulaire, 'Bienvenu (' + titulaire.grade + ') ' + titulaire.nom + ' ' + titulaire.post_nom);
                    
                    break;
            
                case 17:
                    //MODULE SECTION
                    const section = await this.userModel.findModuleByLogin(pseudo, passwd, module);
                    
                    if (!section) return this.sendError(res, 'Not found', 'Vous n\'êtes pas autorisé à accèder au module Section', 404);
                    this.sendSuccess(res, section, 'Bienvenu (' + section.grade + ') ' + section.nom + ' ' + section.post_nom);
                    
                    break;
            
                default:
                    //MODULE JURY
                    const jury = await this.userModel.findModuleByLogin(pseudo, passwd, module);
                    
                    if (!jury) return this.sendError(res, 'Not found', 'Vous n\'êtes pas autorisé à accèder au module Jury', 404);
                    this.sendSuccess(res, jury, 'Bienvenu (' + jury.grade + ') ' + jury.nom + ' ' + jury.post_nom);
                    
                    break;
            }
 
        } catch (err) {
            this.sendError(res, err, 'Un problème inattendu est survenu lors du traitement de votre requête', 500);
        }
    }

    async annees(req, res) {        
        try {
            const years = await this.userModel.findAllYears();
            
            if (!years) return this.sendError(res, 'Not found', 'Aucune ligne trouvée', 404);
            this.sendSuccess(res, years, 'Liste des années académiques');
            
        } catch (err) {
            this.sendError(res, err, 'Un problème inattendu est survenu lors du traitement de votre requête', 500);
        }
    }

}

module.exports = new UserController();