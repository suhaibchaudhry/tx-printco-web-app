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

    },
    changeSlide: function(e) {
      e.preventDefault();
      e.stopPropagation();
      var $slideshow = $('.slideshow');
      var next_slide = $(e.currentTarget.hash);
      var current_slide = $slideshow.find('.active-slide');
      if(!next_slide.hasClass('active-slide') && current_slide.length == 1) {
        next_slide.addClass('active-slide');
        current_slide.addClass('shifted-slide');
        next_slide.addClass('shifted-slide');
        //Use events and Mordernizr later
        setTimeout(function() {
          current_slide.removeClass('active-slide').removeClass('shifted-slide');
          next_slide.removeClass('shifted-slide');
          $slideshow.prepend(next_slide);
        }, 1000);
      }
    }
  });

  var view = App.View.Bootstrap(applicationFrame, 'div.app-wrap');
})(jQuery);
