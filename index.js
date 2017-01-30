(function($) {
   "use strict";

    $.fn.galleryWall = function(options) {
        options = $.extend({
           selector: 'figure',
           imgSource: function(){
             return $(this).find('img').attr('src');
          },
          processedClass: 'processed'
        }, options || {});

        this.each(function() {
            var el = $(this);
            var fullWidth = el.width();
            var freeWidth = fullWidth;
            var row = [];

            el.find(options.selector).each(function(i){
               var fig = $(this);

               if (fig.data('originalWidth')) {
                  fig.width(fig.data('originalWidth'));
               } else {
                  fig.data('originalWidth', fig.width());
               }

               var figWidth = fig.outerWidth(true);

               fig.css('background-image', 'url('+options.imgSource.call(fig)+')');

               if (freeWidth === 0) {
                  // last element fitted perfectly
                  row = [];
                  freeWidth = fullWidth;
               }

               if (figWidth <= freeWidth) {
                  // enough space
                  freeWidth -= figWidth;

                  row.push(fig);
               } else {
                  // not enough space
                  var delta, nextRow = [], nextFreeWidth = fullWidth;

                  if (figWidth / 2 > freeWidth) {
                     // add fig to next row, enlarge all elements in this row
                     delta = freeWidth;

                     nextFreeWidth -= figWidth;
                     nextRow.push(fig);
                  } else {
                     // resize all elements in this row to make some space for
                     // the new element
                     row.push(fig);

                     delta = figWidth - freeWidth;
                     delta *= -1;
                  }

                  // resize all elements
                  $.each(row, function(){
                     var w = $(this).outerWidth(true);
                     var margin = w - $(this).width();

                     $(this).width(w - margin + (w / (fullWidth - delta)) * delta);
                  });

                  freeWidth = nextFreeWidth;
                  row = nextRow;
               }

               fig.addClass(options.processedClass);
            });
        });

        return this;
    };
}(jQuery));
