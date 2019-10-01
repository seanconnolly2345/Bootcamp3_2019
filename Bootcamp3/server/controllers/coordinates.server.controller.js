var config = require('../config/config'), 
    request = require('request');



module.exports = function(req, res, next) {
  if(req.body.address) {
      //This code just formats the address so that it doesn't have space and commas using escape characters
      var addressTemp = req.body.address;
      var addressTemp2 = addressTemp.toLowerCase();
      var addressTemp3 = addressTemp2.replace(/\s/g, "%20");
      var addressTemp4 = addressTemp3.replace(/,/g , "%2C");
      
    //Setup your options q and key are provided. Feel free to add others to make the JSON response less verbose and easier to read 
    var options = { 
      q: addressTemp4,
      key: config.openCage.key,  
    }

    //Setup your request using URL and options - see ? for format
    request({
      url: 'https://api.opencagedata.com/geocode/v1/json', 
      qs: options
      }, function(error, response, body) {
        //For ideas about response and error processing see https://opencagedata.com/tutorials/geocode-in-nodejs
        if (error) console.log('error', error.message);

        //JSON.parse to get contents. Remember to look at the response's JSON format in open cage data
        if (response.statusCode == 200) {
          var json = JSON.parse(body);

        
          req.results = {
            lat: json.results[0].geometry.lat,
            lng: json.results[0].geometry.lng,
          };
        }
       
        next();
    });
  } else {
    next();
  }
};  