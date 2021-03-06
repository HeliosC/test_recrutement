/**
 * SessionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    'new': function(req, res) {
        req.session.authentificated = false;
        res.view('session/new');
    },

    'create': function(req, res, next) {
        //In case we create a session whit the sails create shortcut
        var params = req.body == undefined ? req.query : req.body;

        User.find({username: params.username}, function(err, user){
            if(err) return next(err);
            
            var user = user[0];
            if(user == undefined) {
                res.redirect('/user/new')
                return;
            }

            if(require('password-hash').verify(params.password, user.password)){
                req.session.authentificated = true;
                req.session.user = user;
                res.redirect('/rides/search')
            }else{
                res.redirect('/session/new');
            }
        })
    }

};

