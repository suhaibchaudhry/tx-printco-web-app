(function($) {
  App = {
      basePath: '/',
      selectParamsExtract: function(element) {
        var data = {};
        $.each(element, function(i, e) {
          data[e.name] = e.value;
        });

        return data;
      },
      makeRequest: function(resource, requestType, contextObj, data, successCB, errorCB) {
        var request = {
          type: requestType,
          url: this.basePath+resource
        };

        if(typeof successCB == 'function') {
          request['success'] =  _.bind(successCB, contextObj);
        } else {
          request['success'] =  _.bind(function(res, status, xhr) {
            console.log(res);
          }, contextObj);
        }

        if(typeof errorCB == 'function') {
          request['error'] =  _.bind(errorCB, contextObj);
        } else {
          request['error'] =  _.bind(function(xhr, errorType, error) {
            alert("Could not connect to server. Please try again.");
          }, contextObj);
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
