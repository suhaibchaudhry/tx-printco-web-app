//TX Print Co. data service layer.

var txprintcoData = {
	design_doc: sails.config.txprintco.design_doc,
	db: sails.config.txprintco.db,
	pdb: sails.config.txprintco.pdb,
	createPriceOverride: function(overrideMap) {
		this.pdb.insert(overrideMap);
	},
	makeDataRequest: function(view, params, successCB, errorCB, db, design_doc) {
		var that = this;
		if(_.isObject(db) && _.isString(design_doc)) {
			db.view(design_doc, view, params, _.bind(this.handleCouchResponse, this, params, successCB, errorCB));
		} else {
			this.db.view(this.design_doc, view, params, _.bind(this.handleCouchResponseOverride, this, params, successCB, errorCB));
		}
	},
	handleCouchResponse: function(params, successCB, errorCB, err, data) {
		if(!err && _.isArray(data["rows"]) && data["rows"].length > 0) {
			successCB(err, data["rows"]);
		} else {
			errorCB();
		}
	},
	handleCouchResponseOverride: function(params, successCB, errorCB, err, data) {
		if(!err && _.isArray(data["rows"]) && data["rows"].length > 0) {
			if(_.isArray(params.key)) {
				params["descending"] = true;
				params["limit"] = 1;
				this.pdb.view('txprintco_pricing', 'pricemap', params, _.bind(this.priceOverrideCheck, this, data["rows"], successCB, errorCB));
			} else {
				successCB(err, data["rows"]);
			}
		} else {
			errorCB();
		}
	},
	priceOverrideCheck: function(product, successCB, errorCB, err, data) {
		//console.log(product);
		if(!err && _.isArray(data["rows"]) && data["rows"].length > 0) {
			if(_.isString(data["rows"][0]["value"]) && !_.isEmpty(data["rows"][0]["value"])) {
				_.each(product, function(row) {
						if(_.isString(row["value"]) && !_.isEmpty(row["value"])) {
							row["value"] = data["rows"][0]["value"];
						} else if(_.isString(row["value"]["base_price"]) && !_.isEmpty(row["value"]["base_price"])) {
							row["value"]["base_price"] = data["rows"][0]["value"];
						}
						row["overridden"] = true;
				});
			}
		}

		successCB(err, product);
	}
};

module.exports = txprintcoData;
