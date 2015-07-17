(function($) {
  var applicationFrame = Backbone.View.extend({
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

  var view = App.View.Bootstrap(applicationFrame, 'div.app-wrap');
})(jQuery);
