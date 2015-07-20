/**
 * ProductController
 *
 * @description :: Server-side logic for managing Products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	productList: function (req, res) {
		txprintcoData.makeDataRequest('categories_ordered',
										{group: true},
										_.bind(this.drawCategoryTree, this, req, res),
										_.bind(this.serverErrorResponse, this, req, res));
	},
	drawCategoryTree: function(req, res, err, data) {
		res.view({
		    errors: req.flash('error'),
			data: data
		});
	},
	serverErrorResponse: function(req, res) {
		res.serverError("We were unable to recieve data from the server at this moment, please try again later.");
	},
	serverNotFoundResponse: function(req, res) {
		res.notFound();
	},
	JSONNotFoundResponse: function(req, res) {
		res.json({
			status: false,
			message: 'Could not find any products.'
		});
	},
	product: function (req, res) {
		var that = this;
		var category = req._parsedUrl.pathname.split('/')[2];

		txprintcoData.makeDataRequest('categories',
										{key: category, group: true},
										_.bind(this.productVocabularies, this, req, res, category),
										_.bind(this.serverNotFoundResponse, this, req, res));
	},
	productVocabularies: function(req, res, category, err, data) {
		var category_en = data[0]["value"];

		txprintcoData.makeDataRequest('filters-vocabularies',
										{key: category},
										_.bind(this.productFilters, this, req, res, category_en, category),
										_.bind(this.serverNotFoundResponse, this, req, res));
	},
	productFilters: function(req, res, category_en, category, err, data) {
			res.view({
				errors: req.flash('error'),
				category_en: category_en,
				category: category,
				vocabularies: data[0]["value"]
			});
	},
	getProductsByVendorID: function(req, res, err, data) {
		//Remove duplicates by selecting first, later crawl description for each ?idc flag and figure out something to do with it.
		var products_marked = [];
		var products = [];
		_.each(data, function(row) {
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
	},
	getFilterCategoryProducts: function(req, res, err, data) {
		var uniq = data[0]["value"];

		_.each(data, function(row) {
			uniq = _.intersection(uniq, row["value"]);
		});

		txprintcoData.makeDataRequest('vendor_product_id_map',
										{keys: uniq},
										_.bind(this.getProductsByVendorID, this, req, res),
										_.bind(this.JSONNotFoundResponse, this, req, res));
	},
	productFilteredList: function(req, res) {
		//Possibly cache controller due to heavy lifting.
		if(_.has(req.body, 'category') && _.has(req.body, 'filters') && _.isObject(req.body.filters)) {
			var filter_keys = _.keys(req.body.filters);
			if(filter_keys.length > 0) {
				var filterKeys = [];
				_.each(filter_keys, function(key) {
					filterKeys.push([req.body.category,key,req.body.filters[key]]);
				});

				txprintcoData.makeDataRequest('filters-product-map',
												{keys: filterKeys},
												_.bind(this.getFilterCategoryProducts, this, req, res),
												_.bind(this.serverNotFoundResponse, this, req, res));
			} else {
				res.notFound();
			}
		} else {
			res.notFound();
		}
	}
};
