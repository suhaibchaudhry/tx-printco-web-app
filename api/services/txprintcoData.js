//TX Print Co. data service layer.

var txprintcoData = {
	design_doc: sails.config.txprintco.design_doc,
	db: sails.config.txprintco.db,
	makeDataRequest: function(view, params, successCB, errorCB) {
		var that = this;
		this.db.view(this.design_doc, view, params, _.bind(this.handleCouchResponse, this, successCB, errorCB));
	},
	handleCouchResponse: function(successCB, errorCB, err, data) {
		if(!err && _.isArray(data["rows"]) && data["rows"].length > 0) {
			successCB(err, data["rows"]);
		} else {
			errorCB();
		}
	}
};

module.exports = txprintcoData;
