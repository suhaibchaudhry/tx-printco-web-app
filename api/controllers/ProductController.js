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
		//Possibly cache controller due to heavy lifting.
		var db = sails.config.txprintco.db;

		if(_.has(req.body, 'category') && _.has(req.body, 'filters') && _.isObject(req.body.filters)) {
			var filter_keys = _.keys(req.body.filters);
			if(filter_keys.length > 0) {
				var filterKeys = [];
				_.each(filter_keys, function(key) {
					filterKeys.push([req.body.category,key,req.body.filters[key]]);
				});

				db.view('txprintco', 'filters-product-map', {keys: filterKeys}, function(err, data) {
					if(!err && _.isArray(data["rows"]) && data["rows"].length > 0) {
						var uniq = data["rows"][0]["value"];

						_.each(data["rows"], function(row) {
							uniq = _.intersection(uniq, row["value"]);
						});

						db.view('txprintco', 'vendor_product_id_map', {keys: uniq}, function(err, data) {
							if(!err && _.isArray(data["rows"]) && data["rows"].length > 0) {
								//Remove Duplicates
								var products_marked = [];
								var products = [];
								_.each(data["rows"], function(row) {
									if(_.indexOf(products_marked, row["key"]) == -1) {
										products.push(row["value"]);
										products_marked.push(row["key"]);
									}
								});

								res.json({
									status: true,
									products: products,
									uniq: uniq
								});
							} else {
								res.json({
									status: false,
									message: 'Could not find any products.'
								});
							}
						});
					} else {
						res.notFound();
					}
				});
			} else {
				res.notFound();
			}
		} else {
			res.notFound();
		}
	}
};
