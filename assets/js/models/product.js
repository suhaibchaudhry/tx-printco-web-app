(function($) {
	var product = Backbone.Model.extend({
		initialize: function(attribute, options) {
			this.listenTo(this, 'change:runsize', this.selectedRunsize);
			this.listenTo(this, 'change:color', this.selectedColor);
			this.listenTo(this, 'change:tat', this.selectedTAT);
		},
		selectedRunsize: function(product, runsize, options) {
			this.set("opttotal", "0.00", {silent: true});
			if(runsize) {
				App.makeRequest('rpc/product/colors',
	                      'POST',
	                      this,
	                      {
	                        product_id: this.get("product_id"),
	                        runsize: runsize
	                      },
												this.productColorsLoaded);
				this.set("subtotal", this.get("base_price"));
			} else {
				this.set("subtotal", "0.00");
			}
		},
		selectedColor: function(product, color, options) {
			this.set("opttotal", "0.00", {silent: true});
			if(color) {
				App.makeRequest('rpc/product/tats',
	                      'POST',
	                      this,
	                      {
													category: $('.product-filters').data('category-id'),
	                        product_id: this.get("product_id"),
	                        runsize: this.get('runsize'),
													color: color
	                      },
												this.productTATLoaded);
			} else {
				this.set("subtotal", this.get("base_price"));
			}
		},
		selectedTAT: function(product, tat, options) {
			this.set("opttotal", "0.00", {silent: true});
			if(tat) {
				App.makeRequest('rpc/product/options',
	                      'POST',
	                      this,
	                      {
													category: $('.product-filters').data('category-id'),
	                        product_id: this.get("product_id"),
	                        runsize: this.get('runsize'),
													color: this.get('color'),
													tat: tat
	                      },
												this.productOptionsLoaded);
			} else {
				this.set("subtotal", this.get("best_total"));
			}
		},
		productColorsLoaded: function(res, status, xhr) {
			if(res.status) {
				this.set("colors", false, {silent: true});
				this.set("colors", res.colors);
			} else {
				this.set("colors", false);
			}
		},
		productTATLoaded: function(res, status, xhr) {
			if(res.status) {
				this.set({subtotal: res.price, best_total: res.price});
				this.set("tats", false, {silent: true});
				this.set("tats", res.tats);
			} else {
				App.makeRequest('rpc/product/best-price',
	                      'POST',
	                      this,
	                      {
													category: $('.product-filters').data('category-id'),
	                        product_id: this.get("product_id"),
	                        runsize: this.get('runsize'),
													color: color
	                      },
												this.productTotalLoaded);

				this.set("tats", false);
			}
		},
		productOptionsLoaded: function(res, status, xhr) {
			if(res.status) {
				this.set("subtotal", res.price);
				this.set("vocabularies", false, {silent: true});
				this.set("vocabularies", res.options);
			} else {
				App.makeRequest('rpc/product/price',
	              'POST',
	              this,
	              {
									category: $('.product-filters').data('category-id'),
	                product_id: this.get("product_id"),
	                runsize: this.get('runsize'),
					color: this.get('color'),
					tat: this.get('tat')
	              },
				  this.productTotalLoaded);

				this.set("vocabularies", false);
			}
		},
		productTotalLoaded: function(res, status, xhr) {
			this.set("subtotal", res.price);
		}
	});

	App.Model.Attach("Product", product);
})(jQuery);
