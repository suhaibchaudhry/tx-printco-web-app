/**
 * ProductController
 * @author	    :: Asad Hasan
 * @description :: Provide product loading and management operations using the TXPrintCo data service layer.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	priceOverride: function(req, res) {
		txprintcoData.createPriceOverride(req.body);
		res.json({
			status: true,
			message: 'Override saved.'
		});
	},
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
				var that = this;
				var query_dsl = {
													"sort" : [{
														"base_price": "asc"
													}],
													'size': 1,
													'from': 0,
											    "query": {
											        "filtered": {
											          "filter": { "and": [] }
											        }
											     },
											    "aggs": {}
				};

				_.each(filter_keys, function(key) {
					var value = req.body.filters[key];
					query_dsl["aggs"][key] = {
						"terms": {
							"field": key
						}
					};

					if(value != "false") {
						var item = {"terms": {}};
						var values = [];
						values.push(value);
						item["terms"][key] = values;
						query_dsl["query"]["filtered"]["filter"]["and"].push(item);
				  }
				});

				sails.config.txprintco.elastic_client.search('product', req.body.category, query_dsl)
				.on('data', function(data) {
           that.getFilteredProducts(req, res, JSON.parse(data));
        }).exec();
			} else {
				res.notFound();
			}
		} else {
			res.notFound();
		}
	},
	getFilteredProducts: function(req, res, data) {
		var uniq = [];
		var resultValid = _.has(data, 'hits') && _.has(data.hits, 'hits') && _.isArray(data.hits.hits);
		if(resultValid) {
			_.each(data.hits.hits, function(product) {
				uniq.push(product._source.product_id);
			});
		}

		if(!_.isEmpty(uniq) && resultValid) {
			txprintcoData.makeDataRequest('vendor_product_id_map',
											{keys: uniq},
											_.bind(this.getProductsByVendorID, this, req, res, uniq, data),
											_.bind(this.JSONNotFoundResponse, this, req, res));
		} else {
			this.JSONNotFoundResponse(req, res);
		}
	},
	getProductsByVendorID: function(req, res, uniq, es_data, err, data) {
		//Remove duplicates by selecting first, later crawl description for each ?idc flag and figure out something to do with it.
		var products_marked = [];
		var products = [];
		var that = this;
		_.each(data, function(row) {
			if(_.indexOf(products_marked, row["key"]) == -1) {
				row["value"]["base_price"] = that.applyPriceMarkup(req.body.category, sails.config.txprintco.markup, row["value"]["base_price"]);
				products.push(row["value"]);
				products_marked.push(row["key"]);
			}
		});

		es_data.hits.hits = {
			status: true,
			products: products
		};

		res.json(es_data);
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
		var visited = [];
		_.each(data, function(option) {
			var machine_name = option['key'][4].toLowerCase().replace(/[_\W]+/g, '-');
			if(!_.contains(visited, machine_name)) {
				var vocab = {
					name: option['key'][4],
					machine_name: machine_name,
					values: option['value']
				};
				visited.push(machine_name);
				options.push(vocab);
			}
		});

		this.getProductPrice(req, res, options);
		//res.json({
		//	status: true,
		//	options: options
		//});
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
			price: this.applyPriceMarkup(req.body.category, sails.config.txprintco.markup, data[0]["value"])
		};

		if(_.isArray(tat_data)) {
			response["tats"] = tat_data[0]["value"];
		}

		res.json(response);
	},
	getProductPrice: function(req, res, opt_data) {
		if(_.has(req.body, 'product_id') && _.has(req.body, 'runsize') && _.has(req.body, 'color') && _.has(req.body, 'tat')) {
			txprintcoData.makeDataRequest('price',
											{key: [req.body.product_id,req.body.runsize,req.body.color,req.body.tat]},
											_.bind(this.productPrice, this, req, res, opt_data),
											_.bind(this.JSONNotFoundResponse, this, req, res));
		} else {
			res.notFound();
		}
	},
	productPrice: function(req, res, opt_data, err, data) {
		var response = {
			status: true,
			price: this.applyPriceMarkup(req.body.category, sails.config.txprintco.markup, data[0]["value"]["base_price"])
		};

		if(_.isArray(opt_data)) {
			response["options"] = opt_data;
		}

		res.json(response);
	},
	applyPriceMarkup: function(category, markupMap, price) {
		if(!_.isEmpty(category) && _.has(markupMap, category)) {
			var numPrice = Number(price);
			price = (numPrice+(numPrice*(markupMap[category]/100)));
			return price.toFixed(2);
		}

		return price;
	}
};
