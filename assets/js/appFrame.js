(function($) {
  var applicationFrame = Backbone.View.extend({
    tagName: 'div',
    events: {
      "click .slideshow .menu a": "changeSlide",
      "animationend .slideshow .active-slide": "slideChanged",
      "webkitAnimationEnd .slideshow .active-slide": "slideChanged",
      "oAnimationEnd .slideshow .active-slide": "slideChanged",
      "MSAnimationEnd .slideshow .active-slide": "slideChanged"
    },
    initialize: function() {
      console.log("Initialized");
    },
    render: function() {
      this.$slideshow = this.$('.slideshow');
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
      }
    },
    slideChanged: function(e) {
      console.log("Animation Ended");
      //current_slide.removeClass('active-slide').removeClass('shifted-slide');
      //next_slide.removeClass('shifted-slide');
      //$slideshow.prepend(next_slide);
    }
  });

  var view = App.View.Bootstrap(applicationFrame, 'div.app-wrap');
})(jQuery);
