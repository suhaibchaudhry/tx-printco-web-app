/**
 * ProductController
 * @author			:: Asad Hasan
 * @description :: Provide product loading and management operations using the TXPrintCo data service layer.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	//Resource URI: /product
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
	//Resource URI: /product/*
	parentProduct: function (req, res) {
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
										_.bind(this.productRenderFilters, this, req, res, category_en, category),
										_.bind(this.serverNotFoundResponse, this, req, res));
	},
	productRenderFilters: function(req, res, category_en, category, err, data) {
			res.view({
				errors: req.flash('error'),
				category_en: category_en,
				category: category,
				vocabularies: data[0]["value"]
			});
	},
	//Resource URI: /rpc/product/filter
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
												_.bind(this.getFilteredProducts, this, req, res),
												_.bind(this.serverNotFoundResponse, this, req, res));
			} else {
				res.notFound();
			}
		} else {
			res.notFound();
		}
	},
	getFilteredProducts: function(req, res, err, data) {
		var uniq = data[0]["value"];

		_.each(data, function(row) {
			uniq = _.intersection(uniq, row["value"]);
		});

		txprintcoData.makeDataRequest('vendor_product_id_map',
										{keys: uniq},
										_.bind(this.getProductsByVendorID, this, req, res, uniq),
										_.bind(this.JSONNotFoundResponse, this, req, res));
	},
	getProductsByVendorID: function(req, res, uniq, err, data) {
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
	getColorsForQty: function(req, res) {
		if(_.has(req.body, 'product_id') && _.has(req.body, 'runsize')) {
			txprintcoData.makeDataRequest('colors',
											{key: [req.body.product_id,req.body.runsize]},
											_.bind(this.productColorOptions, this, req, res),
											_.bind(this.JSONNotFoundResponse, this, req, res));
		} else {
			res.notFound();
		}
	},
	productColorOptions: function(req, res, err, data) {
		res.json({
			status: true,
			colors: data[0]["value"]
		});
	},
	getTATForColors: function(req, res) {
		if(_.has(req.body, 'product_id') && _.has(req.body, 'runsize') && _.has(req.body, 'color')) {
			txprintcoData.makeDataRequest('tat',
											{key: [req.body.product_id,req.body.runsize,req.body.color]},
											_.bind(this.productTATOptions, this, req, res),
											_.bind(this.JSONNotFoundResponse, this, req, res));
		} else {
			res.notFound();
		}
	},
	productTATOptions: function(req, res, err, data) {
		this.getProductBestPrice(req, res, data);
		//res.json({
		//	status: true,
		//	tats: data[0]["value"]
		//});
	},
	getOptionsForTAT: function(req, res) {
		if(_.has(req.body, 'product_id') && _.has(req.body, 'runsize') && _.has(req.body, 'color') && _.has(req.body, 'tat')) {
			var key = [req.body.product_id,req.body.runsize,req.body.color,req.body.tat];
			txprintcoData.makeDataRequest('options',
											{key: key},
											_.bind(this.productPrepareOptions, this, req, res, key),
											_.bind(this.JSONNotFoundResponse, this, req, res));
		} else {
			res.notFound();
		}
	},
	productPrepareOptions: function(req, res, baseKey, err, data) {
		if(_.isArray(data[0]["value"]) && data[0]["value"].length > 0) {
			var keys = [];
			_.each(data[0]["value"], function(option) {
				keys.push(_.flatten([baseKey, option]));
			});
			txprintcoData.makeDataRequest('options-object',
											{keys: keys},
											_.bind(this.productAdditionalOptions, this, req, res),
											_.bind(this.JSONNotFoundResponse, this, req, res));
		} else {
			this.JSONNotFoundResponse(req, res);
		}
	},
	productAdditionalOptions: function(req, res, err, data) {
		var options = [];
		_.each(data, function(option) {
			var vocab = {
				name: option['key'][4],
				machine_name: option['key'][4].toLowerCase().replace(/[_\W]+/g, '-'), 
				values: option['value']
			};

			options.push(vocab);
		});

		res.json({
			status: true,
			options: options
		});
	},
	getProductBestPrice: function(req, res, tat_data) {
		if(_.has(req.body, 'product_id') && _.has(req.body, 'runsize') && _.has(req.body, 'color')) {
			txprintcoData.makeDataRequest('best_price',
											{key: [req.body.product_id,req.body.runsize,req.body.color]},
											_.bind(this.productBestPrice, this, req, res, tat_data),
											_.bind(this.JSONNotFoundResponse, this, req, res));
		} else {
			res.notFound();
		}
	},
	productBestPrice: function(req, res, tat_data, err, data) {
		var response = {
			status: true,
			price: data[0]["value"]
		};

		if(_.isArray(tat_data)) {
			response["tats"] = tat_data[0]["value"];
		}

		res.json(response);
	},
	getProductPrice: function(req, res) {
		if(_.has(req.body, 'product_id') && _.has(req.body, 'runsize') && _.has(req.body, 'color') && _.has(req.body, 'tat')) {
			txprintcoData.makeDataRequest('price',
											{key: [req.body.product_id,req.body.runsize,req.body.color,req.body.tat]},
											_.bind(this.productPrice, this, req, res),
											_.bind(this.JSONNotFoundResponse, this, req, res));
		} else {
			res.notFound();
		}
	},
	productPrice: function(req, res, err, data) {
		res.json({
			price: data[0]["value"]["base_price"]
		});
	}
};