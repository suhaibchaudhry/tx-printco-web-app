(function($) {
  App = {};
  App.View = {
      collection: [],
      Bootstrap: function(viewClass, selector) {
        var view = new viewClass({
          el: $(selector).get(0)
        });

        App.View.collection.push(view);
        return view;
      }
  };

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
