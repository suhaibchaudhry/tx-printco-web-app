/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {
 	orderProfileData: function(req, res) {
     res.json({
       authenticated: Boolean(req.session.authenticated)
     });
   }
 };
