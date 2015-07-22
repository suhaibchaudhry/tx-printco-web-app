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
    selectProduct: function(e) {
      this.activeProduct.clear({silent: true});
      this.activeProduct.set(this.activeResult.products[e.currentTarget.dataset.productIndex]);
    },
    productFilterChange: function(e) {
      var $filters = this.$('.product-filters');
      var filters = App.selectParamsExtract($filters.find('select'));

      if(_.isEmpty(filters)) {
        this.$('.product-data').html('Please select an option');
      } else {
        App.makeRequest('rpc/product/filter',
                        'POST',
                        this,
                        {
                          category: $filters.data('category-id'),
                          filters: filters
                        },
                        this.productFilterSuccess);
      }
    },
    selectRunsize: function(e) {
      this.activeProduct.set('runsize', false, {silent: true});
      this.activeProduct.set('runsize', e.currentTarget.value);
    },
    selectColor: function(e) {
      if(e.currentTarget.value == "0") {
        this.activeProduct.set('tats', false);
      } else {
        this.activeProduct.set('color', false, {silent: true});
        this.activeProduct.set('color', e.currentTarget.value);
      }
    },
    selectTAT: function(e) {
      if(e.currentTarget.value == "0") {
        this.activeProduct.set('vocabularies', false);
      } else {
        this.activeProduct.set('tat', false, {silent: true});
        this.activeProduct.set('tat', e.currentTarget.value);
      }
    },
    selectOption: function(e) {
      
    },
    productFilterSuccess: function(res, status, xhr) {
      this.activeResult = res;

      this.$('.product-data').html(
        this.productSummaryTemplate(
          this.activeResult
          )
        );

      if(res.status && res.products.length == 1) {
        this.activeProduct.clear({silent: true});
        this.activeProduct.set(res.products[0]);
      }
      //console.log('%c Product Filtered', 'font-size: 20px; color: red');
      //console.log(res);
    },
    productColorsLoaded: function(product, colors, options) {
        //console.log(colors);
        this.$('.product-colors-choose').html(this.productColorTemplate({
            colors: colors
        }));
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
