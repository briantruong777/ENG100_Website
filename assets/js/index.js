var LINK_FADE_TIME = 300;
var BODY_FADE_TIME = 300;
var c;
var ctx;
var width;
var height;
var imageData;
var pts = new Array();

function resized()
{
	width=$(window).width();
	height=$(window).height();
	$("#bg_canvas").attr("width",width);
	$("#bg_canvas").attr("height",height);
}

function setPixel(x, y, pImageData)
{
	idx = 4*(width*y + x);
	pImageData.data[idx+0] = 255;
	pImageData.data[idx+1] = 255;
	pImageData.data[idx+2] = 255;
	pImageData.data[idx+3] = 255;
}

function clearPixel(x, y, pImageData)
{
	idx = 4*(width*y + x);
	pImageData.data[idx+0] = 0;
	pImageData.data[idx+1] = 0;
	pImageData.data[idx+2] = 0;
	pImageData.data[idx+3] = 0;
}

function draw()
{
	imageData = ctx.createImageData(width, height);
	for (var i = 0; i < pts.length; i += 2)
	{
		clearPixel(pts[i],pts[i+1],imageData);
		pts[i] = pts[i] + 1;
		pts[i+1] = pts[i+1] + 1;
		setPixel(pts[i],pts[i+1],imageData);
	}

	ctx.putImageData(imageData, 0, 0);
}

// Adds event handlers and starts some animations
function onPageShow()
{
	// Fade in main part of <body>
	$(".body-center").css("display", "none");
	$(".body-center").fadeIn(BODY_FADE_TIME);

	// Following two lines for browsers that bfcache, thanks Firefox
	$(".navbar-current").css("opacity","1");
	$(".navbar-link").css("opacity","0.3");

	resized();
	$(window).resize(resized);

	c = document.getElementById('bg_canvas');
	ctx=c.getContext('2d');
	imageData = ctx.createImageData(width, height);
	pts.push(50);
	pts.push(50);

	window.setInterval(draw,10);

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

		$("#bg_canvas").fadeOut(BODY_FADE_TIME);

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
