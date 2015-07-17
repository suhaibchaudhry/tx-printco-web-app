(function($) {
  var productFilters = Backbone.View.extend({
    tagName: 'div',
    events: {
      "change .product-filters select": 'productFilterChange'
    },
    initialize: function() {
      console.log("Initialized");
    },
    render: function() {
      console.log("Rendered");
    },
    productFilterChange: function(e) {
      App.makeRequest('rpc/product/filter',
                      'POST',
                      this,
                      App.selectParamsExtract(this.$('.product-filters select')),
                      this.productFilterSuccess);
    },
    productFilterSuccess: function(res, status, xhr) {
      console.log('%c Product Filtered', 'font-size: 20px; color: red');
      console.log(res);
    }
  });

  var view = App.View.Bootstrap(productFilters, 'div.product-view');
})(jQuery);
