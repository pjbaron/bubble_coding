//
// BubbleDraw.js
//
// Pete Baron 2016
//
// Object to hold data about a drawn representation of a Bubble extending class
//



function BubbleDraw()
{
	this.x = 0;
	this.y = 0;
	this.radiusx = 0;
	this.radiusy = 0;
	this.bubble = undefined;
	this.links = undefined;
	this.parent = undefined;
	this.children = undefined;
	this.bubble = undefined;
}


BubbleDraw.prototype.create = function( _x, _y, _radiusx, _radiusy, _bubble, _links )
{
	this.x = _x;
	this.y = _y;
	this.radiusx = _radiusx;
	this.radiusy = _radiusy;
	this.bubble = _bubble;
	this.links = _links;
};


BubbleDraw.prototype.getLoc = function()
{
	var loc = { x: this.x, y: this.y };

	if ( this.parent )
	{
		// recursive offsets until BubbleDraw object has no parent
		var pl = this.parent.getLoc();
		loc.x += pl.x;
		loc.y += pl.y;
	}

	return loc;
};


BubbleDraw.prototype.draw = function( _ctx )
{
	var loc = this.getLoc();

	// draw a circle
	_ctx.beginPath();
	_ctx.ellipse( loc.x, loc.y, this.radiusx, this.radiusy, 0, 0, 2*Math.PI );
	_ctx.fillStyle = "rgba(64, 64, 64, 0.5)";
	_ctx.fill();
	_ctx.stroke();

	// make sure text label fits the circle (shrink the font until it does)
	var size = 14;
	while( size > 6 )
	{
		_ctx.font = size.toString() + "px arial";
		if ( getTextWidth( this.bubble.name, _ctx.font ) < (this.radiusx * 2 - _ctx.lineWidth * 2) )
		{
			break;
		}
		size--;
	}

	// print the bubble name in it
	_ctx.fillStyle = "#ffffff";
	_ctx.fillText( this.bubble.name, loc.x, loc.y + 7 );
};
