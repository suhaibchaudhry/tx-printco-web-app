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
			if(err) {
				return res.serverError("We were unable to recieve data from the server at this moment, please try again later.");
			} else {
				res.view({
		      errors: req.flash('error'),
					data: body
		    });
			}
		});
  },
	product: function (req, res) {
		var category = req._parsedUrl.pathname.split('/')[2];
		var db = sails.config.txprintco.db;

		db.view('txprintco', 'filters-vocabularies', {key: category}, function(err, data) {
			req.flash('error', JSON.stringify(data));
			if(!err && _.isArray(data["rows"]) && data["rows"].length > 0) {
				res.view({
		      errors: req.flash('error'),
					category: category
		    });
			} else {
				return res.notFound();
			}
		});
  }
};
