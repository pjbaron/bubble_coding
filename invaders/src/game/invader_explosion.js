//
// invader_explosion.js
//
// Pete Baron 2016
//
// show an explosion when the "invader_dead" signal is received
//


invader_explosion = function()
{
	this.data = { x: 0, y: 0, visible: false, count: 0, delay: 10, image: textureManager.getWithKey( "invader_explode" ) };

	Signals.add( "update", this.update, this, null, true );
	Signals.add( "draw", this.draw, this, null, true );
	Signals.add( "invader_dead", this.start, this, null, true );
	Signals.add( "saucer_dead", this.start, this, null, true );
};


BubbleExtend( invader_explosion, "game_start" );


invader_explosion.prototype.update = function()
{
	if ( this.data && this.data.visible )
	{
		this.data.count++;
		if ( this.data.count > this.data.delay )
		{
			this.data.visible = false;
		}
	}
};


invader_explosion.prototype.draw = function( _arg1, _ctx )
{
	if ( this.data && this.data.visible )
	{
		_ctx.drawImage( this.data.image, this.data.x - this.data.image.cellWide / 2, this.data.y - this.data.image.cellHigh / 2);
	}
};


invader_explosion.prototype.start = function( _arg1, _obj )
{
	if ( !this.data.visible )
	{
		this.data.x = _obj.x;
		this.data.y = _obj.y + _obj.image.cellHigh / 2;
		this.data.visible = true;
		this.data.count = 0;
	}
};


