//
// Wire.js
//
// Pete Baron 2016
//
// a single wire with it's path
//



function Wire( _key )
{
	this.key = _key;
	this.path = null;
	this.fromBubble = null;
	this.toBubble = null;
	this.colour = null;
	this.label = null;
}


Wire.prototype.create = function( _path, _fromBubble, _toBubble, _colour )
{
	this.fromBubble = _fromBubble;
	this.toBubble = _toBubble;
	this.colour = _colour;
	this.label = this.key;
	
	if ( !this.path && _path && _path.length > 0 )
	{
		this.path = [];
	}

	for( var i = 0, l = _path.length; i < l; i++ )
	{
		this.path.push( { x: _path[i].x, y: _path[i].y } );
	}
};


Wire.prototype.destroy = function()
{
	this.path = null;
};
