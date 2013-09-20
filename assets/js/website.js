var LINK_FADE_TIME = 300;
var BODY_FADE_TIME = 300;

// Code specifically for Firefox's bfcaching causing issues
function onPageShow()
{
  // Fade in main part of <body>
  var body_center = $("#body-center");
  body_center.css("display", "none");
  body_center.fadeIn(BODY_FADE_TIME);

  // Following two lines for browsers that bfcache, thanks Firefox
  $(".navbar-link").css("opacity","0.3");
  $("#navbar-current").css("opacity","1");
}

$(document).ready(function()
{
  // Firefox's bfcaching causes issues unless I use onpageshow event
  // rather than relying on jQuery's ready()
  if (window.onpageshow === null)
  {
    // Chrome will also take this path
    window.addEventListener("pageshow", onPageShow, false);
  }
  else
  {
    // If browser doesn't support onpageshow, do it now
    onPageShow();
  }

  navbar_link = $(".navbar-link");
  navbar_current = $("#navbar-current");

  // Hover effect for links
  navbar_link.hover(
    function() {
      $(this).animate({opacity:'1'}, {duration:LINK_FADE_TIME,queue:false});
    }, function() {
      $(this).animate({opacity:'0.3'}, {duration:LINK_FADE_TIME,queue:false});
    });
  navbar_current.unbind("mouseleave"); // Don't do effect on current link

  // Page fade out occurs whenever any navbar-link is clicked
  navbar_link.click(function(event) {
    event.preventDefault(); // Intercept page change
    $(this).unbind("mouseleave"); // Don't allow link to go dark
    var dest = this.href; // Save destination page
    // Fade out current page's link
    navbar_current.animate({opacity:'0.3'},{duration:LINK_FADE_TIME,queue:false});
    // Fade out body and only when done, load next page
    $("#body-center").fadeOut(BODY_FADE_TIME,function(){window.location.assign(dest);});
  });
});
