// bombs.js
//
// Pete Baron 2016
//
// control a list of bombs
//


bombs = function( _data )
{
	this.list = [];
	for( var i = 0; i < 8; i++ )
	{
		this.list.push( new bomb( _data.canvas ) );
	}

	Signals.add( "update", this.update, this, null, true );
	Signals.add( "invader_fire", this.shoot, this, null, true );
	Signals.add( "bomb_kill", this.kill, this, null, true );
};


BubbleExtend( bombs, "game_start" );
BubbleEnclose( bombs, bomb );


bombs.prototype.update = function()
{
	if ( this.list )
	{
		// update all bombs
		for( var i = this.list.length - 1; i >= 0; --i )
		{
			this.list[i].update();
		}
	}
};


bombs.prototype.shoot = function( _args1, _obj )
{
	// find an available bomb
	for( var i = this.list.length - 1; i >= 0; --i )
	{
		var b = this.list[i];
		if ( !b.data.visible )
		{
			b.activate( _obj );
			break;
		}
	}
};


bombs.prototype.kill = function( _args1, _obj )
{
	// find the matching bomb and deactivate it
	for( var i = this.list.length - 1; i >= 0; --i )
	{
		var b = this.list[i];
		if ( b.data === _obj )
		{
			b.deactivate();
			break;
		}
	}
};


