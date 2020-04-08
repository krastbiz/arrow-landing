var onWheel = function(e) {
  console.log(e);
}

$(document).ready(function() {

  $("header a").on('click', function(event) {
    event.preventDefault();
    
    if(this.hash){

      var hash = this.hash;

      var offset = $(this.hash).offset().top;

      var svgs = $(`${hash}>svg:first-of-type`);
      if (svgs.length > 0) {
        offset += svgs[0].clientHeight;
      }

      console.log($(this.hash).offset());
      $('html, body').animate({
        scrollTop: offset
      }, 0, function() {
        window.location.hash = hash;
      });
    }
  });
});