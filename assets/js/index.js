var LINK_FADE_TIME = 300;
var BODY_FADE_TIME = 300;
var ctx;
var scrWidth;
var scrHeight;
var mouseX;
var mouseY;
var pts = []; // [x,y,xVelocity,yVelocity, ... ]
var genTimer;

// Called when window resized
function resized()
{
	scrWidth=window.innerWidth;
	scrHeight=window.innerHeight;
	$("#bg_canvas").attr("width",scrWidth);
	$("#bg_canvas").attr("height",scrHeight);
}

// Called when mouse is moved over Canvas
function getMousePos(event)
{
	mouseX = event.clientX;
	mouseY = event.clientY;
}

// Adds new random point to array
function genPoint()
{
	var velX = Math.floor(21*Math.random()) - 10;
	var velY = Math.floor(21*Math.random()) - 10;
	if (velX == 0 || velY == 0)
	{
		var rand;
		if (Math.random() > 0.5)
			rand = 1;
		else
			rand = -1;

		if (Math.random() > 0.5)
			velX = rand;
		else
			velY = rand;
	}
	pts.push(mouseX, mouseY, velX, velY);
}

// Generates a point and then sets up timer to generate more points
function genPointCont(event)
{
	genPoint();
	genTimer = setInterval(genPoint, 10);
}

// Cancels the point generator timer
function cancelGenPointCont()
{
	clearInterval(genTimer);
}

// Sets a specific pixel white
function setPixel(x, y, pImageData)
{
	var idx = 4*(scrWidth*y + x);
	pImageData.data[idx] = 255;
	pImageData.data[idx+1] = 255;
	pImageData.data[idx+2] = 255;
	pImageData.data[idx+3] = 255;
}

// Draws a single animation step. Moves all points.
function draw(timeStamp)
{
	var imageData = ctx.createImageData(scrWidth, scrHeight);
  var x;
  var y;
  var len = pts.length;
	for (var i = 0; i < len; i += 4)
	{
		x = pts[i];
		y = pts[i+1];

		x += pts[i+2];
		y += pts[i+3];

		if (x < 0)
		{
			x = 0;
			pts[i+2] = -1 * pts[i+2];
		}
		else if (x > scrWidth)
		{
			x = scrWidth;
			pts[i+2] = -1 * pts[i+2];
		}

		if (y < 0)
		{
			y = 0;
			pts[i+3] = -1 * pts[i+3];
		}
		else if (y > scrHeight)
		{
			y = scrHeight;
			pts[i+3] = -1 * pts[i+3];
		}

		setPixel(x,y,imageData);

		pts[i] = x;
		pts[i+1] = y;
	}

	ctx.putImageData(imageData, 0, 0);
	window.requestAnimationFrame(draw);
}

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

  // Fade in canvas
	$("#bg_canvas").css("display", "none");
	$("#bg_canvas").fadeIn(BODY_FADE_TIME);
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
  // Fade out the canvas
  $("#bg_canvas").fadeOut(BODY_FADE_TIME);
  // Fade out body and only when done, load next page
  $("#body-center").fadeOut(BODY_FADE_TIME,
    function(){window.location.assign(dest);}
  );
}




$(document).ready(function()
{
  // If Chrome of Firefox
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

	// Hover effect for links
	$(".navbar-link").hover(aniLinkOn, aniLinkOff);
  // Don't do effect on current link
	$("#navbar-current").unbind("mouseleave");

	// Page fade out occurs whenever any navbar-link is clicked
	$(".navbar-link").click(linkClick);



  // Fill in the initial values for window size
	resized();
  // Set up event listener
	window.onresize = resized;

	var c = document.getElementById('bg_canvas');
	ctx=c.getContext('2d');

	c.onmousedown = genPointCont;
	c.onmouseup = cancelGenPointCont;
	c.onmouseout = cancelGenPointCont;
	c.onmousemove = getMousePos;

  // Begins animation cycle
	window.requestAnimationFrame(draw);
});
