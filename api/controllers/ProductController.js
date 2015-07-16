/**
 * ProductController
 *
 * @description :: Server-side logic for managing Products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	productList: function (req, res) {
		var db = sails.config.txprintco.db;
		db.view('txprintco', categories, function(err, body) {
			console.log(body);
		});

    res.view({
      errors: req.flash('error')
    });
  },
	product: function (req, res) {
    res.view({
      errors: req.flash('error')
    });
  }
};
