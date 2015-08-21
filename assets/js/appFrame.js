(function($) {
  var applicationFrame = Backbone.View.extend({
    tagName: 'div',
    events: {
      "click .slideshow .menu a": "changeSlide"
    },
    initialize: function() {
      console.log("Initialized");
    },
    render: function() {
      this.$slideshow = this.$('.slideshow');
    },
    delegateAnimationEnd: function(next_slide, current_slide) {
      this.callback = _.debounce(
                        _.bind(this.slideChanged, this, next_slide, current_slide)
                      , 300, true);
      next_slide.bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", this.callback);
    },
    changeSlide: function(e) {
      e.preventDefault();
      e.stopPropagation();
      var next_slide = this.$(e.currentTarget.hash);
      var current_slide = this.$slideshow.find('.active-slide');
      if(!next_slide.hasClass('active-slide') && current_slide.length == 1) {
        next_slide.addClass('active-slide');
        current_slide.addClass('shifted-slide');
        next_slide.addClass('shifted-slide');

        if (Modernizr.cssanimations) {
          this.delegateAnimationEnd(next_slide, current_slide);
        } else {
          this.slideChanged(next_slide, current_slide);
        }
      }
    },
    slideChanged: function(next_slide, current_slide, e) {
      if (Modernizr.cssanimations) {
        next_slide.unbind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", this.callback);
      }
      current_slide.removeClass('active-slide').removeClass('shifted-slide');
      next_slide.removeClass('shifted-slide');
      this.$slideshow.prepend(next_slide);
    }
  });

  var view = App.View.Bootstrap(applicationFrame, 'div.app-wrap');
})(jQuery);
