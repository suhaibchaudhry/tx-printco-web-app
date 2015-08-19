(function($) {
	$('.footer .menu').equalHeights();
	$('.middle-content .block').equalHeights();

	//Slideshow, Move in to its own file later.
	var $slideshow = $('.slideshow');
	$slideshow.find('.menu a').click(function(e) {
		e.preventDefault();
		e.stopPropagation();
	  var next_slide = $(e.currentTarget.hash);
		var current_slide = $('.slideshow .active-slide');
		if(!next_slide.hasClass('active-slide') && current_slide.length == 1) {
			next_slide.addClass('active-slide');
			current_slide.addClass('shifted-slide');
			next_slide.addClass('shifted-slide');
			setTimeout(function() {
				current_slide.removeClass('active-slide').removeClass('shifted-slide');
				next_slide.removeClass('shifted-slide');
				$slideshow.prepend(next_slide);
			}, 1000);
		}
	});
})(jQuery);
