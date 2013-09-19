var LINK_FADE_TIME = 300;
var BODY_FADE_TIME = 300;
var c;
var ctx;
var width;
var height;
var ctrX;
var ctrY;
var mouseX;
var mouseY;
var imageData;
var pts = new Array();
var timeout;

function resized()
{
	width=$(window).width();
	height=$(window).height();
	ctrX = Math.floor(width / 2);
	ctrY = Math.floor(height / 2);
	$("#bg_canvas").attr("width",width);
	$("#bg_canvas").attr("height",height);
}

function getMousePos(event)
{
	mouseX = event.clientX;
	mouseY = event.clientY;
}

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

function genPointCont(event)
{
	genPoint();
	timeout = setInterval(genPoint, 10);
}

function cancelGenPointCont()
{
	clearInterval(timeout);
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

function draw(timeStamp)
{
	imageData = ctx.createImageData(width, height);
	for (var i = 0; i < pts.length; i += 4)
	{
		pts[i] += pts[i+2];
		pts[i+1] += pts[i+3];

		if (pts[i] < 0)
		{
			pts[i] = 0;
			pts[i+2] = -1 * pts[i+2];
		}
		else if (pts[i] > width)
		{
			pts[i] = width;
			pts[i+2] = -1 * pts[i+2];
		}

		if (pts[i+1] < 0)
		{
			pts[i+1] = 0;
			pts[i+3] = -1 * pts[i+3];
		}
		else if (pts[i+1] > height)
		{
			pts[i+1] = height;
			pts[i+3] = -1 * pts[i+3];
		}

		setPixel(pts[i],pts[i+1],imageData);
	}

	ctx.putImageData(imageData, 0, 0);
	window.requestAnimationFrame(draw);
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

	$(".navbar").css("background-color","transparent");

	resized();
	$(window).resize(resized);

	c = document.getElementById('bg_canvas');
	ctx=c.getContext('2d');
	imageData = ctx.createImageData(width, height);
	pts.push(ctrX);
	pts.push(ctrY);
	pts.push(1);
	pts.push(0);
	pts.push(ctrX);
	pts.push(ctrY);
	pts.push(0);
	pts.push(1);
	pts.push(ctrX);
	pts.push(ctrY);
	pts.push(-1);
	pts.push(0);
	pts.push(ctrX);
	pts.push(ctrY);
	pts.push(0);
	pts.push(-1);
	pts.push(ctrX);
	pts.push(ctrY);
	pts.push(1);
	pts.push(1);
	pts.push(ctrX);
	pts.push(ctrY);
	pts.push(-1);
	pts.push(1);
	pts.push(ctrX);
	pts.push(ctrY);
	pts.push(1);
	pts.push(-1);
	pts.push(ctrX);
	pts.push(ctrY);
	pts.push(-1);
	pts.push(-1);

	c.onmousedown = genPointCont;
	c.onmouseup = cancelGenPointCont;
	c.onmouseout = cancelGenPointCont;
	c.onmousemove = getMousePos;

//	window.setInterval(draw,10);
	window.requestAnimationFrame(draw);

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
