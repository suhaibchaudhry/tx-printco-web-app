(function($) {
  var productFilters = Backbone.View.extend({
    tagName: 'div',
    productSummaryTemplate: this.window.JST["assets/templates/product-summary.html"],
    productNewFormTemplate: this.window.JST["assets/templates/product-form.html"],
    activeResult: {},
    activeProduct: new App.Model.Product(),
    events: {
      "change .product-filters select": 'productFilterChange',
      "change .product-runsizes select": 'selectRunsize',
      "click .product-data .multipleResultChild": 'selectProduct'
    },
    initialize: function() {
      console.log("Initialized");
      this.listenTo(this.activeProduct, "change:product_id", this.productChange);
    },
    render: function() {
      console.log("Rendered");
    },
    productChange: function(product, value, options) {
      this.$('.product-options').html(this.productNewFormTemplate({
        runsizes: product.get('runsizes')
      }));


    },
    selectProduct: function(e) {
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
    selectRunsize: function(e) {
      console.log(e);
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
