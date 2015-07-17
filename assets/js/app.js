(function($) {
  App = {
      basePath: '/',
      makeRequest: function(resource, requestType, contextObj, sucessCB, errorCB, data) {
        var request = {
          type: requestType,
          url: this.basePath+resource,
          success: _.bind(successCB, contextObj),
          error: _.bind(errorCB, contextObj)
        };

        if(typeof success == 'function') {
          request['success'] =  _.bind(successCB, contextObj);
        }

        if(typeof error == 'function') {
          request['error'] =  _.bind(errorCB, contextObj);
        }

        if(typeof data == 'object') {
          request['data'] = data;
        }

        $.ajax(request);
      },
      View: {
          collection: [],
          Bootstrap: function(viewClass, selector) {
            var view = new viewClass({
              el: $(selector).get(0)
            });

            App.View.collection.push(view);
            return view;
          }
      }
  };
})(jQuery);
