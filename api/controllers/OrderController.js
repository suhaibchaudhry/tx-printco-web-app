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
  },
  submitOrder: function(req, res) {
		Order.create(req.body).exec(function(err, data){
			if (err){
				res.json({
		     	status: false,
					error: err
		   	});
			} else {
				res.json({
		     	status: true
		   	});
			}
		});
	}
 };
