//
// player_explosion.js
//
// Pete Baron 2016
//
// show an explosion when the "player_dead" signal is received
//


player_explosion = function()
{
	this.data = { x: 0, y: 0, visible: false, count: 0, delay: 15, image: textureManager.getWithKey( "ship_explode" ) };

	Signals.add( "update", this.update, this, null, true );
	Signals.add( "draw", this.draw, this, null, true );
	Signals.add( "player_dead", this.start, this, null, true );
};


BubbleExtend( player_explosion, "game_start" );


player_explosion.prototype.update = function()
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


player_explosion.prototype.draw = function( _arg1, _ctx )
{
	if ( this.data && this.data.visible )
	{
		_ctx.drawImage( this.data.image, this.data.x - this.data.image.cellWide / 2, this.data.y - this.data.image.cellHigh / 2);
	}
};


player_explosion.prototype.start = function( _arg1, _obj )
{
	if ( !this.data.visible )
	{
		this.data.x = _obj.x;
		this.data.y = _obj.y + _obj.image.cellHigh / 2;
		this.data.visible = true;
		this.data.count = 0;
	}
};



