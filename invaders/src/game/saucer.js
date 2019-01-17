// saucer.js
//
// Pete Baron 2016
//
// create a saucer after 21 shots, each time it appears it travels in the other direction
//


function saucer( _data )
{
	this.canvas = _data.canvas;
	this.data = { name: "saucer", x:0, y:20, image: textureManager.getWithKey( "saucer" ), visible: false, vx: 6, moving: false };
	this.data.x = -this.data.image.cellWide / 2;
	this.shotCount = 0;
	Signals.dispatch( "collider_add", this.data );

	Signals.add( "update", this.update, this, null, true );
	Signals.add( "draw", this.draw, this, null, true );
	Signals.add( "collision", this.collision, this, null, true );
	Signals.add( "bullet_fired", this.shotCounter, this, null, true );
}


BubbleExtend( saucer, "game_start" );


saucer.prototype.update = function()
{
	if ( this.data && this.data.moving )
	{
		this.data.x += this.data.vx;

		if ( ( this.data.vx < 0 && this.data.x < this.data.image.cellWide / 2 ) ||
			 ( this.data.vx > 0 && this.data.x > this.canvas.width - this.data.image.cellWide / 2 ) )
		{
			this.data.visible = false;
			this.data.moving = false;
			// next one travels the other way
			this.data.vx = -this.data.vx;
		}
	}
};


saucer.prototype.draw = function( _arg1, _ctx )
{
	if ( this.data && this.data.visible )
	{
		_ctx.drawImage( this.data.image, this.data.x - this.data.image.cellWide / 2, this.data.y );
	}
};


saucer.prototype.collision = function( _arg1, _obj )
{
	if ( _obj.who === this.data )
	{
		if ( _obj.what.name == "bullet" )
		{
			// console.log( "saucer shot by bullet" );
			// hide the saucer, but leave it moving so it gets to the other end of the track ready to return next time
			this.data.visible = false;
			Signals.dispatch( "saucer_dead", this.data );
		}
	}
};


saucer.prototype.shotCounter = function( _arg1, _arg2 )
{
	this.shotCount++;
	if ( this.shotCount >= 21 )
	{
		this.shotCount = 0;
		this.data.moving = true;
		this.data.visible = true;
	}
};



