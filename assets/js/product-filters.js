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
      "click .product-data .multipleResultChild": 'selectProduct',
      "click .order-now": 'initiateOrderProcess',
      "click .order-submit": 'submitOrderButton',
      "submit .order-form form": 'submitOrderForm',
      "keypress .order-form form": 'submitOrderFormKeypress'
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
      this.$(".product-filters select:gt(0)").attr("disabled", true);
      this.productFilterChange(false);
    },
    productChange: function(product, value, options) {
      this.$('.order-pane').hide();
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
        var $select = $filters.find('select');

        var after_flag = false;
        var act = 0;
        $select.each(function(i, ele) {
          var $ele = $(ele);
          if(after_flag) {
            $ele.val("0");
          }
          if($ele.attr("name") == e.currentTarget.name) {
            after_flag = true;
          }
        });
        var filters = App.selectParamsExtract($select);
        console.log(filters);

        if(App.testCollectionValues(filters)) {
          this.emptyResultMessage();

          $select.each(function(i, ele) {
            var $ele = $(ele);
            if(i == 0) {
              $ele.attr("disabled", false);
            } else {
              $ele.attr("disabled", true);
            }
          });
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
      this.$('.order-pane').hide();
      if(e.currentTarget.value == "0") {
        this.activeProduct.set({tat: false, color: false}, {silent: true});
        this.activeProduct.set({runsize: false, colors: false});
      } else {
        this.activeProduct.set('runsize', false, {silent: true});
        this.activeProduct.set('runsize', e.currentTarget.value);
      }
    },
    selectColor: function(e) {
      this.$('.order-pane').hide();
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
        this.$('.order-pane').hide();
        this.activeProduct.set({tat: false, vocabularies: false});
      } else {
        this.$('.order-pane').show();
        this.activeProduct.set('tat', false, {silent: true});
        this.activeProduct.set('tat', e.currentTarget.value);
      }
    },
    selectOption: function(e) {
      //To be made cross browser
      var total = 0;
      //this.$('.order-pane').show();
      this.$(".product-options > select > option:selected").each(function(i, e) {
        total += parseFloat(e.dataset.optionFee);
      });
      this.activeProduct.set("opttotal", total);
    },
    subtotalChanged: function(product, subtotal, options) {
      subtotal = parseFloat(product.get("subtotal"))+parseFloat(product.get("opttotal"));
      this.$('.product-form .subtotal span.value').text(subtotal.toFixed(2));
    },
    visitFilterToTheRight: function($ele, name, currentTarget, res) {
      //$ele is the select being visiting
      var count = $ele.find('option').length;
      if(count == 1) {
        if(!$ele.is(':disabled')) {
          this.forceEnableNextSelect = true;
        }
        $ele.attr("disabled", true);
        $ele.prev().hide();
        $ele.hide();
      } else {
        $ele.prev().show();
        $ele.show();
        if(count == 2) {
          if(currentTarget.selectedIndex != "0" && res.aggregations[name]["buckets"][0].doc_count == res.aggregations[currentTarget.name]["buckets"][0].doc_count) {
            if(!$ele.is(':disabled')) {
              this.forceEnableNextSelect = true;
            }
            $ele.find('option:eq(1)').attr('selected', 'selected');
            $ele.attr("disabled", true);
          }
        }
      }
    },
    populateFiltersToTheRight: function(i, act, after_flag, $ele, name, currentTarget, res) {
      if(after_flag) {
        if(_.has(res["aggregations"], name)) {
          if(_.has(res.aggregations[name], "buckets")) {
            $ele.find('option[value!="0"]').remove();
            var opts = "";
            _.each(res.aggregations[name]["buckets"], function(o, i) {
              var escapedKey = _.escape(o.key);
              opts += '<option value="'+escapedKey+'">'+escapedKey+'</option>';
            });

            $ele.append(opts);
            if(this.forceEnableNextSelect || i == act+1) {
              $ele.attr("disabled", false);
              this.forceEnableNextSelect = false;
            } else if(i > act+1) {
              $ele.attr("disabled", true);
            }

            if(i > act) {
              this.visitFilterToTheRight($ele, name, currentTarget, res);
            }
          }
        }
      }
    },
    productFilterSuccess: function(e, res, status, xhr) {
      //e.currentTarget.name;
      var that = this;
      var after_flag = false;
      var act = 0;
      this.forceEnableNextSelect = false;
      this.$(".product-filters select").each(function(i, ele) {
        var $ele = $(ele);
        var name = $ele.attr("name");
        console.log(ele.name);
        that.populateFiltersToTheRight(i, act, after_flag, $ele, name, e.currentTarget, res);

        if(name == e.currentTarget.name) {
          after_flag = true;
          act = i;
        }
      });

      //Populate products the old way for now.
      if(_.has(res, 'hits') && _.has(res.hits, 'hits') && _.has(res.hits.hits, 'status')) {
        this.activeResult = res.hits.hits;

        this.$('.product-data').html(
          this.productSummaryTemplate(
            this.activeResult
            )
          );

        if(res.hits.hits.status && res.hits.hits.products.length == 1) {
          this.activeProduct.clear({silent: true});
          this.activeProduct.set(res.hits.hits.products[0]);
        }
      } else {
        this.$('.product-data').html('Please select an option');
      }

      //Auto open next option (Not designed for every browser.)
      var nextPrompted = this.$('.product-filters select:not(:disabled)').last().get(0);
      if(e.currentTarget.name == nextPrompted.name) {
        App.autoOpenSelect(this.$('.product-runsizes select').get(0));
      } else {
        App.autoOpenSelect(nextPrompted);
      }
    },
    productColorsLoaded: function(product, colors, options) {
        //console.log(colors);
        if(colors) {
          this.$('.product-colors-choose').html(this.productColorTemplate({
              colors: colors
          }));
          App.autoOpenSelect(this.$('.product-colors select').get(0));
        } else {
          this.$('.product-colors-choose').empty();
        }
    },
    productTATLoaded: function(product, tats, options) {
      if(tats) {
        this.$('.product-tat-choose').html(this.productTATTemplate({
          tats: tats
        }));
        App.autoOpenSelect(this.$('.product-tats select').get(0));
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
    },
    initiateOrderProcess: function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.$('.order-form').show();
      this.$('.order-form .email').focus();
      this.$('.order-button').hide();
      this.$('.product-filters select, .product-runsizes select, .product-colors-choose select').attr("disabled", "disabled");
    },
    submitOrderButton: function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.$('.order-form form').trigger('submit');
    },
    submitOrderForm: function(e) {
      e.preventDefault();
      e.stopPropagation();
      var $form = this.$('.order-form form');
      var productOrdered = this.compileOrderedProduct();
      $form.find('label.error').removeClass('error');
      $form.find('small.error').remove();

      var reqData = $form.serializeObject();
      reqData['productOrdered'] = productOrdered;

      App.makeRequest('order/submitorder',
                      'POST',
                      this,
                      reqData,
                      this.submitOrderResponse);
    },
    compileOrderedProduct: function() {
        var options = {};
        this.$('.product-fields select').each(function() {
          var $this = $(this);
          options[$this.attr('name')] = {
            field_name: $this.prev('label').text(),
            field_selection: $this.find('option:selected').text()
          };
        });

        return options;
    },
    submitOrderFormKeypress: function(e) {
      if(e.keyCode=='13') {
        this.$('.order-form form').trigger('submit');
      }
    },
    submitOrderResponse: function(res, status, xhr) {
      if (res.status) {

      } else {
        _.each(res.error.invalidAttributes, _.bind(this.highlightField, this));
      }
    },
    highlightField: function(val, key) {
      this.$('input[name="'+key+'"]').parent().addClass("error").after('<small class="error">Invalid entry</small>');
    }
  });

  var view = App.View.Bootstrap(productFilters, 'div.product-view');
})(jQuery);
