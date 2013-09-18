var LINK_FADE_TIME = 300;
var BODY_FADE_TIME = 1000;
var num_wallpaper = 9;
var current_wallpaper = Math.floor(Math.random()*num_wallpaper);

function nextWallpaper()
{
	current_wallpaper++;
	if (current_wallpaper >= num_wallpaper)
		current_wallpaper = 0;
	$("#bg-image").attr("src", "assets/img/bg/bg"+current_wallpaper+".jpg");
	$("#bg-image").css("display", "none");
	$("#bg-image").fadeIn(2500);
}

// Adds event handlers and starts some animations
function onPageShow()
{
//	window.setInterval(nextWallpaper, 2500);
	nextWallpaper();

	// Fade in main part of <body>
	$(".body-center").css("display", "none");
	$(".body-center").fadeIn(BODY_FADE_TIME);

	// Following two lines for browsers that bfcache, thanks Firefox
	$(".navbar-current").css("opacity","1");
	$(".navbar-link").css("opacity","0.3");

	// Hover effect for links
	$(".navbar-link").hover(
		function()
		{
			$(this).animate({opacity:'1'}, {duration:LINK_FADE_TIME,queue:false});
		},
		function()
		{
			$(this).animate({opacity:'0.3'}, {duration:LINK_FADE_TIME,queue:false});
		});
}

$(document).ready(function()
{
	// Firefox's bfcaching causes issues unless I use onpageshow event
	// instead of relying on jQuery's ready()
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

	// Page fade out occurs whenever any navbar-link is clicked
	$(".navbar-link").click(function(event) {
		event.preventDefault(); // Intercept page change
		$(this).unbind("mouseleave"); // Don't allow link to go dark
		var dest = this.href; // Save destination page

		$("#bg-image").fadeOut(BODY_FADE_TIME);
		// Fade out current page's link
		$(".navbar-current").animate({opacity:'0.3'},{duration:LINK_FADE_TIME,queue:false});
		// Fade out body and only when done, load next page
		$(".body-center").fadeOut(BODY_FADE_TIME,function(){window.location.assign(dest);});
	});
});




/*
var foo = null;

function doMove()
{
	foo.style.left = parseInt(foo.style.left)+1+'px';
	if (parseInt(foo.style.left) < 500)
		setTimeout(doMove, 20);
}

function init()
{
	foo = document.getElementById ("fooObject");
	foo.style.left='0px';
	doMove();
}

window.onload = init;
*/
