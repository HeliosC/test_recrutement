module.exports = function(req, res, next) {
    if(req.session.authentificated) {
        return next();
    }else{
        res.redirect('/session/new');
    }
}
