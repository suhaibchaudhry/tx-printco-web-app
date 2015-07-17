/**
 * ProductController
 *
 * @description :: Server-side logic for managing Products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	productList: function (req, res) {
		var db = sails.config.txprintco.db;
		db.view('txprintco', 'categories_ordered', {group: true}, function(err, body) {
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
		var that = this;
		var db = sails.config.txprintco.db;

		var category = req._parsedUrl.pathname.split('/')[2];

		db.view('txprintco', 'categories', {key: category, group: true}, function(err, data) {
			if(!err && _.isArray(data["rows"]) && data["rows"].length > 0) {
				//req.flash('error', JSON.stringify(data));
				var category_en = data["rows"][0]["value"];
				var dispatch = _.bind(function(err, data) {
					that.productFilters(req, res, err, data, category_en, category);
				}, that);
				db.view('txprintco', 'filters-vocabularies', {key: category}, dispatch);
			} else {
				res.notFound();
			}
		});
  },
	productFilters: function(req, res, err, data, category_en, category) {
		//req.flash('error', JSON.stringify(data));
		if(!err && _.isArray(data["rows"]) && data["rows"].length > 0) {
			res.view({
				errors: req.flash('error'),
				category_en: category_en,
				category: category,
				vocabularies: data["rows"][0]["value"]
			});
		} else {
			res.notFound();
		}
	},
	productFilteredList: function(req, res) {
		/*_.each(req.body, function(e) {
			console.log(e);
		});*/
		if(_.has(req.body, 'category') && _.has(req.body, 'filters') && _.isObject(req.body.filters) && req.body.filters.length > 0) {
			res.json(req.body);
		} else {
			res.notFound();
		}
	}
};
