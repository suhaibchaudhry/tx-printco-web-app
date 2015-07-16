/**
 * ProductController
 *
 * @description :: Server-side logic for managing Products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	productList: function (req, res) {
		var db = sails.config.txprintco.db;
		db.view('txprintco', 'categories', {group: true}, function(err, body) {
			//if(err) {
				return res.serverError("We were unable to recieve data from the server at this moment, please try again later.");
			//}
		});

    /*res.view({
      errors: req.flash('error')
    });*/
  },
	product: function (req, res) {
    res.view({
      errors: req.flash('error')
    });
  }
};
