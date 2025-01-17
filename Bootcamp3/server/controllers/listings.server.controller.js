
/* Dependencies */
var mongoose = require('mongoose'), 
    Listing = require('../models/listings.server.model.js'),
    coordinates = require('./coordinates.server.controller.js');
    
/*
  In this file, you should use Mongoose queries in order to retrieve/add/remove/update listings.
  On an error you should send a 404 status code, as well as the error message. 
  On success (aka no error), you should send the listing(s) as JSON in the response.

  HINT: if you are struggling with implementing these functions refer back to this tutorial 
  https://www.callicoder.com/node-js-express-mongodb-restful-crud-api-tutorial/
  or
  https://medium.com/@dinyangetoh/how-to-build-simple-restful-api-with-nodejs-expressjs-and-mongodb-99348012925d
  

  If you are looking for more understanding of exports and export modules - 
  https://www.sitepoint.com/understanding-module-exports-exports-node-js/
  or
  https://adrianmejia.com/getting-started-with-node-js-modules-require-exports-imports-npm-and-beyond/
 */

/* Create a listing */
exports.create = function(req, res) {

  /* Instantiate a Listing */
  var listing = new Listing(req.body);

  /* save the coordinates (located in req.results if there is an address property) */
  if(req.results) {
    listing.coordinates = {
      latitude: req.results.lat, 
      longitude: req.results.lng
    };
  }
 
  /* Then save the listing */
  listing.save(function(e) {
    if(e) {
      console.log(e);
      res.status(404).send(e);
    } else {
      res.json(listing);
      console.log(listing)
    }
  });
};

/* Show the current listing */
exports.read = function(req, res) {
  /* send back the listing as json from the request */
  res.json(req.listing);
};

/* Update a listing - note the order in which this function is called by the router*/
exports.update = function(req, res) {
  
  var listing = req.listing;

  listing.name = req.body.name;
  listing.code = req.body.code;
  listing.address = req.body.address;
  
  listing.coordinates = { latitude: req.body.latitude, longitude: req.body.longitude }
  
  
  listing.save(function(e) {
    if (e) {
      res.status(404).send(e);
      console.log("Could not save: ", e);
    } 
    else
    {
      res.json(listing);
      console.log("Saved Sucessfully");
    }
})

};

/* Delete a listing */
exports.delete = function(req, res) {
  var listing = req.listing;
  
  listing.remove(function(e){ 
  if (e){
      res.status(404).send(e); 
      console.log("Error Deleting Listing ", e); 
    return;
  }
  else{
      res.end();
      console.log("Removal Successful");
  }
  })

};

/* Retreive all the directory listings, sorted alphabetically by listing code */
exports.list = function(req, res) {
  mongoose.model('Listing', Listing.listingSchema).find({}, function(e, listings){ // Gets all listings 
    if (e){
      res.status(404).send(e); 
      console.log("Error retrieving full directory ", e); 
      return;
  }
  else{
    res.json(listings); //Outputs retrieved listings 
    console.log("Retrieved"); 
  }
  })  
};

/* 
  Middleware: find a listing by its ID, then pass it to the next request handler. 
 */
exports.listingByID = function(req, res, next, id) {
  Listing.findById(id).exec(function(e, listing) {
    if(e) {
      res.status(404).send(e);
    } else {
      req.listing = listing;
      next();
    }
  });
};