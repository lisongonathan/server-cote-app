class Controller {
    //Méthode pour envoyer des réponses réussies
    sendSuccess(res, data, message = 'Success', statusCode = 200) {
        res.status(statusCode).json({
            status: 'success',
            message,
            data,
        });
    }

    //Méthode pour envoyer des réponses d'erreur
    sendError(res, error, message = 'Error', statusCode = 500) {
        res.status(statusCode).json({
            status: 'error',
            message,
            error: error.message || error
        })
    }
}

module.exports = Controller;