//Configure DropZone
Dropzone.options.fileUploader = {
  init: function() {
       this.on('error', function(file, response) {
           // (assuming your response object has an errorMessage property...)
           var errorMessage = 'An error occured while uploading.';
           if(_.has(response, 'errorMessage')) {
             errorMessage = response.errorMessage;
           } else if(_.has(response, 'message')) {
             errorMessage = response.message;
           }

           $(file.previewElement).find('.dz-error-message').text(errorMessage);
       });
   }
};

//Bootstrap App
(function($) {
  $(document).ready(function() {
    App.View.RenderAll();
  });
})(jQuery);
