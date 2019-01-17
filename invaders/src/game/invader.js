// invader.js
//
// Pete Baron 2016
//
// move an invader (created by the invaders bubble, maintained as a member of its 'list' parameter)
//


function invader( _canvas, _variety, _x, _y )
{
	this.canvas = _canvas;

	this.frames =
	[
		textureManager.getWithKey( "invader" + _variety.toString() + "_0" ),
		textureManager.getWithKey( "invader" + _variety.toString() + "_1" )
	];

	this.data = { name: "invader", x:_x, y:_y, cell: 0, image: this.frames[0], alive: true, remove: false };
	this.data.leftEdge = this.data.image.cellWide;
	this.data.rightEdge = this.canvas.width - this.data.image.cellWide;

	Signals.add( "invader_move", this.move, this, null, true );
	Signals.add( "collision", this.collision, this, null, true );
	Signals.dispatch( "collider_add", this.data );
}


BubbleExtend( invader );


invader.prototype.update = function()
{
	if ( this.data.remove )
	{
		this.data.remove = false;
		Signals.dispatch( "collider_remove", this.data );
		Signals.deactivate( "invader_move", this.move, this );
		Signals.deactivate( "collision", this.collision, this );
		Signals.dispatch( "invader_dead", this.data );
	}

	return this.data.alive;
};


invader.prototype.draw = function( _arg1, _ctx )
{
	if ( this.data && this.data.alive )
	{
		// draw the invader
		_ctx.drawImage( this.data.image, this.data.x - this.data.image.cellWide / 2, this.data.y );
	}
};


// return true when this invader reaches the end of the row
invader.prototype.move = function( _vx, _vy )
{
	if ( this.data.alive )
	{
		// animate
		this.data.cell ^= 1;
		this.data.image = this.frames[ this.data.cell ];

		// move as directed, but only one direction at a time
		if ( _vy === 0 )
		{
			this.data.x += _vx;
		}
		else
		{
			this.data.y += _vy;
			if ( this.data.y > this.canvas.height )
			{
				// the invader somehow made it off the bottom of the screen!
				this.data.alive = false;
				Signals.dispatch( "collider_remove", this.data );
			}
		}

		// detect either end of the row
		if ( this.data.x <= this.data.leftEdge && _vx < 0 )
		{
			return true;
		}
		if ( this.data.x >= this.data.rightEdge && _vx > 0 )
		{
			return true;
		}
	}

	return false;
};


invader.prototype.collision = function( _arg1, _obj )
{
	// check if it was this particular invader that got shot
	if ( _obj.who == this.data )
	{
		if ( _obj.what.name == "player" )
		{
			//console.log( "invader caught player!" );
		}

		if ( _obj.what.name == "bullet" )
		{
			//console.log( "invader shot by bullet" );
			this.data.alive = false;
			this.data.remove = true;
		}
	}
};

