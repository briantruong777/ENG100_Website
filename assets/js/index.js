var LINK_FADE_TIME = 300;
var BODY_FADE_TIME = 300;
var ctx;
var width;
var height;
var ctrX;
var ctrY;
var mouseX;
var mouseY;
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
	var idx = 4*(width*y + x);
	pImageData.data[idx+0] = 255;
	pImageData.data[idx+1] = 255;
	pImageData.data[idx+2] = 255;
	pImageData.data[idx+3] = 255;
}

function clearPixel(x, y, pImageData)
{
	var idx = 4*(width*y + x);
	pImageData.data[idx+0] = 0;
	pImageData.data[idx+1] = 0;
	pImageData.data[idx+2] = 0;
	pImageData.data[idx+3] = 0;
}

function draw(timeStamp)
{
	var imageData = ctx.createImageData(width, height);
	for (var i = 0; i < pts.length; i += 4)
	{
		var x = pts[i];
		var y = pts[i+1];

		x += pts[i+2];
		y += pts[i+3];

		if (x < 0)
		{
			x = 0;
			pts[i+2] = -1 * pts[i+2];
		}
		else if (x > width)
		{
			x = width;
			pts[i+2] = -1 * pts[i+2];
		}

		if (y < 0)
		{
			y = 0;
			pts[i+3] = -1 * pts[i+3];
		}
		else if (y > height)
		{
			y = height;
			pts[i+3] = -1 * pts[i+3];
		}

		setPixel(x,y,imageData);

		pts[i] = x;
		pts[i+1] = y;
	}

	ctx.putImageData(imageData, 0, 0);
	window.requestAnimationFrame(draw);
}

// Adds event handlers and starts some animations
function onPageShow()
{
	// Following two lines for browsers that bfcache, thanks Firefox
	$(".navbar-link").css("opacity","0.3");
	$("#navbar-current").css("opacity","1");

	// Fade in main part of <body>
	$("#body-center").css("display", "none");
	$("#body-center").fadeIn(BODY_FADE_TIME);

	$("#bg_canvas").css("display", "none");
	$("#bg_canvas").fadeIn(BODY_FADE_TIME);


}

$(document).ready(function()
{
	$("#navbar").css("background-color","transparent");

	resized();
	window.onresize = resized;

	var c = document.getElementById('bg_canvas');
	ctx=c.getContext('2d');
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
	$("#navbar-current").unbind("mouseleave");
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
		$("#navbar-current").animate({opacity:'0.3'},{duration:LINK_FADE_TIME,queue:false});
		// Fade out body and only when done, load next page
		$("#body-center").fadeOut(BODY_FADE_TIME,function(){window.location.assign(dest);});
	});
});
