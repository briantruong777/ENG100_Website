var LINK_FADE_TIME = 300;
var BODY_FADE_TIME = 300;

// Code specifically for Firefox's bfcaching causing issues:
// This is run whenever Firefox goes back/forwards and a cached page is
// brought to the front
// Also run on jQuery's ready()
function onPageShow()
{
  // Fade in main part of <body>
  $("#body-center").css("display", "none");
  $("#body-center").fadeIn(BODY_FADE_TIME);

  // Make sure normal css styles are restored
  $(".navbar-link").css("opacity","0.3");
  $("#navbar-current").css("opacity","1");
}

// For link hover event listener
function aniLinkOn()
{
  $(this).animate({opacity:'1'}, {duration:LINK_FADE_TIME,queue:false});
}
// For link hover event listener
function aniLinkOff()
{
  $(this).animate({opacity:'0.3'}, {duration:LINK_FADE_TIME,queue:false});
}

// For link click event listener
function linkClick(event)
{
  // Intercept page change
  event.preventDefault();
  // Don't allow link to go dark
  $(this).unbind("mouseleave");
  // Save destination page
  var dest = this.href;
  // Fade out current page's link
  $("#navbar-current").animate({opacity:'0.3'},{duration:LINK_FADE_TIME,queue:false});
  // Fade out body and only when done, load next page
  $("#body-center").fadeOut(BODY_FADE_TIME,
    function(){window.location.assign(dest);}
  );
}

$(document).ready(function()
{
  // If Chrome or Firefox
  if (window.onpageshow === null)
  {
    window.addEventListener("pageshow", onPageShow, false);
  }
  else // IE
  {
    onPageShow();
  }

  // Hover effect for links
  $(".navbar-link").hover(aniLinkOn, aniLinkOff);
  // Don't do effect on current link
  $("#navbar-current").unbind("mouseleave");

  // Page fade out occurs whenever any navbar-link is clicked
  $(".navbar-link").click(linkClick);
});
