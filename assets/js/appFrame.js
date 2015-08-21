(function($) {
  var applicationFrame = Backbone.View.extend({
    tagName: 'div',
    events: {
      "click .slideshow .menu a": "changeSlide"
    },
    initialize: function() {
      this.queuedSlide = false;
    },
    render: function() {
      this.$slideshow = this.$('.slideshow');
    },
    delegateAnimationEnd: function(next_slide, current_slide) {
      this.callback = _.bind(this.slideChanged, this, next_slide, current_slide);
      next_slide.bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", this.callback);
    },
    switchSlide: function(next_slide, current_slide) {
      next_slide.addClass('active-slide');
      current_slide.addClass('shifted-slide');
      next_slide.addClass('shifted-slide');

      if (Modernizr.cssanimations) {
        this.delegateAnimationEnd(next_slide, current_slide);
      } else {
        this.slideChanged(next_slide, current_slide);
      }
    },
    changeSlide: function(e) {
      e.preventDefault();
      e.stopPropagation();
      var next_slide = this.$(e.currentTarget.hash);
      var current_slide = this.$slideshow.find('.active-slide');
      if(!next_slide.hasClass('active-slide') && current_slide.length == 1) {
        this.switchSlide(next_slide, current_slide);
      } else if(!next_slide.hasClass('active-slide') && current_slide.length > 1) {
        this.queuedSlide = next_slide;
      }
    },
    slideChanged: function(next_slide, current_slide, e) {
      if (Modernizr.cssanimations) {
        next_slide.unbind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", this.callback);
      }
      current_slide.removeClass('active-slide').removeClass('shifted-slide');
      next_slide.removeClass('shifted-slide');
      this.$slideshow.prepend(next_slide);
      if(_.isObject(this.queuedSlide) && !this.queuedSlide.hasClass('active-slide')) {
        this.switchSlide(this.queuedSlide, next_slide);
      }

      this.queuedSlide = false;
    }
  });

  var view = App.View.Bootstrap(applicationFrame, 'div.app-wrap');
})(jQuery);
