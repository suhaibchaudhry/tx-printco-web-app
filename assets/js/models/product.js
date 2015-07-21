(function($) {
	var product = Backbone.Model.extend({
		initialize: function(attribute, options) {
			this.listenTo(this, 'change:runsize', this.selectedRunsize);
			this.listenTo(this, 'change:color', this.selectedColor);
			this.listenTo(this, 'change:tat', this.selectedTAT);
		},
		selectedRunsize: function(product, runsize, options) {
			App.makeRequest('rpc/product/colors',
                      'POST',
                      this,
                      {
                        product_id: this.get("product_id"),
                        runsize: runsize
                      },
											this.productColorsLoaded);
		},
		selectedColor: function(product, color, options) {
			App.makeRequest('rpc/product/tats',
                      'POST',
                      this,
                      {
                        product_id: this.get("product_id"),
                        runsize: this.get('runsize'),
												color: color
                      },
											this.productTATLoaded);
		},
		selectedTAT: function(product, tat, options) {
				App.makeRequest('rpc/product/options',
	                      'POST',
	                      this,
	                      {
	                        product_id: this.get("product_id"),
	                        runsize: this.get('runsize'),
													color: this.get('color'),
													tat: tat
	                      },
												this.productOptionsLoaded);
		},
		productColorsLoaded: function(res, status, xhr) {
			if(res.status) {
				this.set("colors", res.colors);
			} else {
				this.set("colors", false);
			}
		},
		productTATLoaded: function(res, status, xhr) {
			if(res.status) {
				this.set("tats", res.tats);
			} else {
				this.set("tats", false);
			}
		},
		productOptionsLoaded: function(res, status, xhr) {
			console.log(res);
		}
	});

	App.Model.Attach("Product", product);
})(jQuery);
