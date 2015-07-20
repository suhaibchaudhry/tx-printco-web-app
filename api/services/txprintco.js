//TX Print Co. data service layer.

var txprintco = {
	design_doc: sails.config.txprintco.design_doc,
	db: sails.config.txprintco.db,
	makeDataRequest: function(view, params, successCB, errorCB) {
		var that = this;
		db.view(this.design_doc, view, params, function(err, data) {
			that.handleCouchResponse(err, data, successCB, errorCB);
		});
	},
	handleCouchResponse: function(err, data, successCB, errorCB) {
		if(!err && _.isArray(data["rows"]) && data["rows"].length > 0) {
			successCB(data["rows"]);
		} else {
			errorCB();
		}
	}
};

modules.export = txprintco;