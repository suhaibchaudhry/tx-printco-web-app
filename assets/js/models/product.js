(function($) {
	var product = Backbone.Model.extend({
		initialize: function(attribute, options) {
			this.listenTo(this, 'change:runsize', this.selectedRunsize);
			this.listenTo(this, 'change:color', this.selectedColor);
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
			console.log(color);
		},
		productColorsLoaded: function(res, status, xhr) {
			if(res.status) {
				this.set("colors", res.colors);
			} else {
				this.set("colors", false);
			}
		}
	});

	App.Model.Attach("Product", product);
})(jQuery);
