(function($) {
  App = {
      basePath: '/',
      selectParamsExtract: function(element) {
        var data = {};
        element.each(function(i, e) {
          if(e.value == "0") {
            data[e.name] = false;
          } else {
            data[e.name] = e.value;
          }
        });

        return data;
      },
      testCollectionValues: function(obj) {
        for (var i in obj) {
            if (obj[i] !== false) {
                return false;
            }
        }

        return true;
      },
      makeRequest: function(resource, requestType, contextObj, data, successCB, errorCB) {
        var request = {
          type: requestType,
          url: this.basePath+resource
        };

        if(_.isFunction(successCB)) {
          request['success'] =  _.bind(successCB, contextObj);
        } else {
          request['success'] =  _.bind(function(res, status, xhr) {
            console.log(res);
          }, contextObj);
        }

        if(_.isFunction(errorCB)) {
          request['error'] =  _.bind(errorCB, contextObj);
        } else {
          request['error'] =  _.bind(function(xhr, errorType, error) {
            alert("Could not connect to server. Please try again.");
          }, contextObj);
        }

        if(_.isObject(data)) {
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
          },
          RenderAll: function() {
            _.each(this.collection, this.Render);
          },
          Render: function(view) {
            view.render();
          }
      },
      Model: {
        Attach: function(className, modelClassObj) {
          this[className] = modelClassObj;
        }
      }
  };
})(jQuery);
