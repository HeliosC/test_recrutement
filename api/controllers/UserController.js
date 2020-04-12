/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    'new': function(req, res) {
        res.view('user/new');
    },

    'createUser': function(req, res) {
        if(req.body.password != req.body.confirmation){
            res.redirect("/user/new");
        }else{
            req.body.password = require('password-hash').generate(req.body.password);
            User.create(req.body, function(err, user){
                res.redirect("/user");
            }) 
        }
    }

};
