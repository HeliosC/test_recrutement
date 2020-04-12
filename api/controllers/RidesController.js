/**
 * RidesController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    
    'result': function(req, res) {
        getAllOffers(req,res);
    },
    'getAllOffers': function(req, res) {
        identityCheck(req, res, function(req, res){
            getAllOffers(req,res);
        })
    },
    'getAllOffersWhithoutLoging': function(req, res) {
        getAllOffers(req,res);
    }

};

function identityCheck(req, res, next){
    params = req.headers;

    //Duplicate from SessionController
    User.find({username: params.username}, function(err, user){
        if(err){
            res.send(err);
        }
        
        var user = user[0];
        if(user == undefined) {
            res.send("undefined user");
        }
        if(require('password-hash').verify(params.password, user.password)){
            req.session.authentificated = true;
            req.session.user = user;
            next(req, res);
        }else{
            res.send("unvalid password");
        }
    })
}

function getAllOffers(req, res){

    //In case we use the form
    var coordinates = req.body == undefined ? req.query : req.body;
            
    var headers = {
        'x-api-key': process.env.API_Token,
        'Content-Type': 'application/json'
    };
    
    var body = `{   \
        "startLatitude": ${coordinates.startLatitude}, \
        "startLongitude": ${coordinates.startLongitude}, \
        "endLatitude": ${coordinates.endLatitude},   \
        "endLongitude": ${coordinates.endLongitude}   \
    }`;
    
    var options = {
        url: 'https://api.external.thegoodseat.fr/getalloffers',
        method: 'POST',
        headers,
        body: body
    };
    
    require('request')(options, callback);
    
    function callback(error, response, body) {
        if(error){
            console.error('getAllOffers failed:', error);
            return;
        }
        if (response.statusCode != 200) {
            console.error('getAllOffers failed with status code:', response.statusCode);
            return;
        }
        res.send(provideData(body));
    };
}

function provideData(body){
    const filter = ['offerId', 'providerCode', 'category', 'price', 'arrivalTime', 'currency'];
    var data = JSON.parse(body);
    var ridesData = {statusCode: 200, body: []}
    for(i = 0; i < data.body.length; i++){
        var ride = data.body[i];
        var rideData = {};
        Object.keys(ride).forEach(key => {
            if(filter.includes(key)){
                rideData[key] = ride[key];
            };
        });
        ridesData.body.push(rideData);
    };
    return ridesData;
};