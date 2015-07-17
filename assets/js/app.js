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

  var appBootstrap = function() {
  	var app = new applicationFrame({
  		el: $('div.app-wrap').get(0)
  	});

    return app;
  };

  var app = appBootstrap();
})(jQuery);
