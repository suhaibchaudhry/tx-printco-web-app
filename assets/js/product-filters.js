(function($) {
  var productFilters = Backbone.View.extend({
    tagName: 'div',
    productSummaryTemplate: this.window.JST["assets/templates/product-summary.html"],
    productNewFormTemplate: this.window.JST["assets/templates/product-form.html"],
    productColorTemplate: this.window.JST["assets/templates/product-colors.html"],
    productTATTemplate: this.window.JST["assets/templates/product-tats.html"],
    productOptionsTemplate: this.window.JST["assets/templates/product-options.html"],
    activeResult: {},
    activeProduct: new App.Model.Product(),
    events: {
      "change .product-filters select": 'productFilterChange',
      "change .product-runsizes select": 'selectRunsize',
      "change .product-colors select": 'selectColor',
      "change .product-tats select": 'selectTAT',
      "change .product-options select": 'selectOption',
      "click .product-data .multipleResultChild": 'selectProduct'
    },
    initialize: function() {
      console.log("Initialized");
      this.listenTo(this.activeProduct, "change:product_id", this.productChange);
      this.listenTo(this.activeProduct, "change:colors", this.productColorsLoaded);
      this.listenTo(this.activeProduct, "change:tats", this.productTATLoaded);
      this.listenTo(this.activeProduct, "change:vocabularies", this.productOptionsLoaded);
      this.listenTo(this.activeProduct, "change:subtotal", this.subtotalChanged);
      this.listenTo(this.activeProduct, "change:opttotal", this.subtotalChanged);
    },
    render: function() {
      console.log("Rendered");
      //Takes too long
      this.productFilterChange(false);
    },
    productChange: function(product, value, options) {
      this.$('.product-options').html(this.productNewFormTemplate({
        runsizes: product.get('runsizes')
      }));
    },
    emptyResultMessage: function() {
      this.$('.product-data').html('Please select an option');
    },
    productFilterChange: function(e) {
      if(e) {
        var $filters = this.$('.product-filters');
        var filters = App.selectParamsExtract($filters.find('select'));
        console.log(filters);

        if(App.testCollectionValues(filters)) {
          this.emptyResultMessage();
        } else {
          App.makeRequest('rpc/product/filter',
                          'POST',
                          this,
                          {
                            category: $filters.data('category-id'),
                            filters: filters
                          },
                          _.bind(this.productFilterSuccess, this, e));
        }
      } else {
        this.emptyResultMessage();
      }
    },
    selectProduct: function(e) {
      this.activeProduct.clear({silent: true});
      //To be made cross browser
      this.activeProduct.set(this.activeResult.products[e.currentTarget.dataset.productIndex]);
    },
    selectRunsize: function(e) {
      if(e.currentTarget.value == "0") {
        this.activeProduct.set({tat: false, color: false}, {silent: true});
        this.activeProduct.set({runsize: false, colors: false});
      } else {
        this.activeProduct.set('runsize', false, {silent: true});
        this.activeProduct.set('runsize', e.currentTarget.value);
      }
    },
    selectColor: function(e) {
      if(e.currentTarget.value == "0") {
        this.activeProduct.set('tat', false, {silent: true});
        this.activeProduct.set({color: false, tats: false});
      } else {
        this.activeProduct.set('color', false, {silent: true});
        this.activeProduct.set('color', e.currentTarget.value);
      }
    },
    selectTAT: function(e) {
      if(e.currentTarget.value == "0") {
        this.activeProduct.set({tat: false, vocabularies: false});
      } else {
        this.activeProduct.set('tat', false, {silent: true});
        this.activeProduct.set('tat', e.currentTarget.value);
      }
    },
    selectOption: function(e) {
      //To be made cross browser
      var total = 0;
      this.$(".product-options > select > option:selected").each(function(i, e) {
        total += parseFloat(e.dataset.optionFee);
      });
      this.activeProduct.set("opttotal", total);
    },
    subtotalChanged: function(product, subtotal, options) {
      subtotal = parseFloat(product.get("subtotal"))+parseFloat(product.get("opttotal"));
      this.$('.product-form .subtotal span.value').text(subtotal.toFixed(2));
    },
    productFilterSuccess: function(e, res, status, xhr) {
      console.log(res);
      console.log(e);
      //e.currentTarget.name;

      var after_flag = false;
      this.$(".product-filters select").each(function(i, ele) {
        var $ele = $(ele);
        var name = $ele.attr("name");
        console.log(ele.name);

        if(after_flag) {
          if(_.has(res["aggregations"], name)) {
            if(_.has(res.aggregations[name], "buckets")) {
              $ele.find('option[value!="0"]').remove();
              var opts = "";
              _.each(res.aggregations[name]["buckets"], function(o, i){
                opts += '<option value="'+o.key+'">'+o.key+'</option>';
              });

              $ele.append(opts);
            }
          }
        }

        if(name == e.currentTarget.name) {
          after_flag = true;
        }
      });
      /*this.activeResult = res;

      this.$('.product-data').html(
        this.productSummaryTemplate(
          this.activeResult
          )
        );

      if(res.status && res.products.length == 1) {
        this.activeProduct.clear({silent: true});
        this.activeProduct.set(res.products[0]);
      }*/
      //console.log('%c Product Filtered', 'font-size: 20px; color: red');
      //console.log(res);
    },
    productColorsLoaded: function(product, colors, options) {
        //console.log(colors);
        if(colors) {
          this.$('.product-colors-choose').html(this.productColorTemplate({
              colors: colors
          }));
        } else {
          this.$('.product-colors-choose').empty();
        }
    },
    productTATLoaded: function(product, tats, options) {
      if(tats) {
        this.$('.product-tat-choose').html(this.productTATTemplate({
          tats: tats
        }));
      } else {
        this.$('.product-tat-choose').empty();
      }
    },
    productOptionsLoaded: function(product, vocabularies, options) {
      if(vocabularies) {
        this.$('.product-opt-choose').html(this.productOptionsTemplate({
          vocabularies: vocabularies
        }));
      } else {
        this.$('.product-opt-choose').empty();
      }
    }
  });

  var view = App.View.Bootstrap(productFilters, 'div.product-view');
})(jQuery);
