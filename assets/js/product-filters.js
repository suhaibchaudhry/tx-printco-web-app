(function($) {
  var productFilters = Backbone.View.extend({
    tagName: 'div',
    productSummaryTemplate: this.window.JST["assets/templates/product-summary.html"],
    activeResult: {},
    activeProduct: new App.Model.Product(),
    events: {
      "change .product-filters select": 'productFilterChange',
      "click .product-data .multipleResultChild": 'selectSubProduct',
    },
    initialize: function() {
      console.log("Initialized");
      this.listenTo(this.activeProduct, "change:product_id", this.subProductChange);
    },
    render: function() {
      console.log("Rendered");
    },
    subProductChange: function(model, value, options) {
      console.log(model.attributes);
      console.log(value);
      console.log(options);
    },
    selectSubProduct: function(e) {
      this.activeProduct.set(this.activeResult.products[e.currentTarget.dataset.productIndex]);
    },
    productFilterChange: function(e) {
      var $filters = this.$('.product-filters');

      App.makeRequest('rpc/product/filter',
                      'POST',
                      this,
                      {
                        category: $filters.data('category-id'),
                        filters: App.selectParamsExtract($filters.find('select'))
                      },
                      this.productFilterSuccess);
    },
    productFilterSuccess: function(res, status, xhr) {
      this.activeResult = res;
      this.$('.product-data').html(
        this.productSummaryTemplate(
          this.activeResult
          )
        );

      if(res.status && res.products.length == 1) {
        this.activeProduct.set(res.products[0]);
      }
      console.log('%c Product Filtered', 'font-size: 20px; color: red');
      console.log(res);
    }
  });

  var view = App.View.Bootstrap(productFilters, 'div.product-view');
})(jQuery);
