(function($) {
  var productFilters = Backbone.View.extend({
    tagName: 'div',
    events: {

    },
    initialize: function() {
      console.log("Initialized");
    },
    render: function() {
      console.log("Rendered");
    }
  });

  var view = App.View.Bootstrap(productFilters, 'div.product-view');
})(jQuery);
