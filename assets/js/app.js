(function($) {
  App = {
      basePath: '/',
      preloaderSemaphore: 0,
      startPreloader: function() {
        console.log("Start Preloader");
      },
      endPreloader: function() {
        console.log("End Preloader");
      },
      evaluatePreloader: function() {
        if(this.preloaderSemaphore > 0) {
          this.startPreloader();
        } else {
          this.endPreloader();
        }
      },
      triggerPreloader: function(status) {
        if(status) {
          this.preloaderSemaphore++;
        } else {
          this.preloaderSemaphore--;
        }
        this.evaluatePreloader();
      },
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
      autoOpenSelect: function(domEle) {
        var e = document.createEvent("MouseEvents");
        e.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        //Right now dispatching has to wait for new elements to be created. Develop an os specific strategy for the future.
        setTimeout(function() {
          domEle.dispatchEvent(e);
        }, 250);
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
        this.triggerPreloader(true);
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

        request['complete'] = _.bind(function(jqXHR, textStatus) {
          this.triggerPreloader(false);
        }, this);

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
