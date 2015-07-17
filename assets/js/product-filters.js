(function($) {
  var productFilters = Backbone.View.extend({
    tagName: 'div',
    events: {
      "change .product-filters select": 'lookupProduct'
    },
    initialize: function() {
      console.log("Initialized");
    },
    render: function() {
      console.log("Rendered");
    },
    lookupProduct: function(e) {
      console.log(this.$('.product-filters select').val());
      $.ajax({
        type: 'POST',
        url: App.basePath+'rpc/product/filter',

        timeout: 1500,
        success: function(res, status, xhr) {

        },
        error: function() {

        }
      });
    }
  });

  var view = App.View.Bootstrap(productFilters, 'div.product-view');
})(jQuery);
