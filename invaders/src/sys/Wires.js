//
// Wires.js
//
// Pete Baron 2016
//
// manager for all of the wires connecting bubbles
//



function Wires()
{
	this.list = null;
	this.colIndex = 0;
	this.colTable = null;
}


// _surface must have a .width and a .height (in pixels)
Wires.prototype.create = function( _surface )
{
	this.list = [];
	this.colTable = makeColorGradient( 0.10, 0.11, 0.12 );
};


function dec2hex(d)
{
	d = Math.floor(d);
	return (d+0x100).toString(16).substr(-2).toUpperCase();
}


function makeColorGradient(frequency1, frequency2, frequency3)
{
	var list = [];
	for (var i = 0; i < 256; i++)
	{
		var r = Math.sin(frequency1 * i + 0) * 127 + 128;
		var g = Math.sin(frequency2 * i + 2) * 127 + 128;
		var b = Math.sin(frequency3 * i + 4) * 127 + 128;
		list[i] = "#" + dec2hex(r) + dec2hex(g) + dec2hex(b);
	}
	return list;
}


// _bubble must have an .x, .y and .radiusx/y (in pixels)
Wires.prototype.addBubble = function( _bubble )
{
};


Wires.prototype.addWire = function( _key, _fromBubble, _fromAngle, _toBubble, _toAngle )
{
//	var angleOffsets = [ 0, 1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6, -6, 7, -7, 8, -8, 9, -9 ];
	var angleOffsets = [ 0, 2, -2, 1, -1, 3, -3, 4, -4 ];

	// find path between bubbles with minimal crossings, and mark it with a wire (list entry)
	// path should start and end at the bubble surface at a specified angle from the centre
	var fl = _fromBubble.links.length;
	if ( fl > angleOffsets.length )
	{
		alert( "There are more wires exiting this bubble than we know what to do with!", _fromBubble.bubble.name, fl );
	}

	// has this key been used before with this _fromBubble?
	var keyIndex = _fromBubble.links.indexOfPropertyValue( "key", _key );
	if ( keyIndex !== -1 )
	{
		// adjust the exit angle to reuse the previous one
		_fromAngle += angleOffsets[ keyIndex ] * Math.PI / 6;
	}
	else
	{
		// set the exit angle for the new wire leaving _fromBubble
		_fromAngle += angleOffsets[ fl ] * Math.PI / 6;
	}
	colour = this.colTable[ this.colIndex % this.colTable.length ];
	this.colIndex++;


	var from = _fromBubble.getLoc();
	var fx = from.x + Math.sin( _fromAngle ) * _fromBubble.radiusx;
	var fy = from.y + Math.cos( _fromAngle ) * _fromBubble.radiusy;

	var to = _toBubble.getLoc();
	var tx = to.x + Math.sin( _toAngle ) * _toBubble.radiusx;
	var ty = to.y + Math.cos( _toAngle ) * _toBubble.radiusy;

	var path = [ { x: fx - from.x, y: fy - from.y }, { x: tx - to.x, y: ty - to.y } ];
	var wire = new Wire( _key );
	wire.create( path, _fromBubble, _toBubble, colour );
	this.list.push( wire );

	return wire;
};


Wires.prototype.draw = function( _ctx, _canvas )
{
	_ctx.lineWidth = 12;
	_ctx.font = "12px arial";

	var i, j, k, l;

	for( i = 0, l = this.list.length; i < l; i++ )
	{
		var w = this.list[i];
		var p = w.path;

		if ( !showChildren )
		{
			if ( w.fromBubble.parent ) continue;
			if ( w.toBubble.parent ) continue;
		}

		var from = w.fromBubble.getLoc();
		var to = w.toBubble.getLoc();
		
		_ctx.fillStyle = w.colour;
		_ctx.strokeStyle = w.colour;
		this.circle( _ctx, p[0], from, 6 );

		_ctx.globalAlpha = 0.25;
		this.moveTo( _ctx, p[0], from );
		for( j = 1, k = p.length; j < k; j++ )
		{
			if ( j < k - 1)
			{
				// all path points are relative to "from", except for the last one
				this.lineTo( _ctx, p[j], from );
			}
			else
			{
				// the last path point is relative to "to"
				this.lineTo( _ctx, p[j], to );
			}
			_ctx.stroke();
		}
		_ctx.globalAlpha = 1.0;

		this.circle( _ctx, p[k - 1], to, 6 );

		var p0p = { x: p[0].x + from.x, y: p[0].y + from.y };
		var pkp = { x: p[k - 1].x + to.x, y: p[k - 1].y + to.y };
		p0p.y += 4;
		pkp.y += 4;

		var dx = pkp.x - p0p.x;
		var dy = pkp.y - p0p.y;
		var angle = Math.atan2(dy, dx);

		// keep wire labels the right way up
		if ( angle < -Math.PI / 2 ) angle += Math.PI;
		if ( angle > Math.PI / 2 ) angle -= Math.PI;

		// TODO: buffer all text and draw it all at the end so it never gets over-printed by other lines/circles
		_ctx.strokeStyle = "white";
		_ctx.fillStyle = "white";
		_ctx.translate( p0p.x + dx / 2, p0p.y + dy / 2 );
		_ctx.rotate( angle );
		_ctx.textAlign = "center";
		_ctx.fillText( w.label, 0, 0 );
		_ctx.resetTransform();
	}

};


// TODO: remove all this drawing specific stuff out of the logic class (create WireDraw object to handle it)

Wires.prototype.moveTo = function( _ctx, _path, _loc )
{
	_ctx.moveTo( Math.round(_path.x + _loc.x), Math.round(_path.y + _loc.y) );
};


Wires.prototype.lineTo = function( _ctx, _path, _loc )
{
	_ctx.lineTo( Math.round(_path.x + _loc.x), Math.round(_path.y + _loc.y) );
};


Wires.prototype.circle = function( _ctx, _path, _loc, _radius )
{
	_ctx.beginPath();
	_ctx.arc( Math.round(_path.x + _loc.x), Math.round(_path.y + _loc.y), Math.round(_radius), 0, 2*Math.PI );
	_ctx.fill();
	_ctx.stroke();
};
