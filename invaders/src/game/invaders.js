// invaders.js
//
// Pete Baron 2016
//
// control a list of invaders
//


invaders = function( _data )
{
	var varieties = [ 3, 2, 2, 1, 1 ];

	this.list = [];
	var y;
	for( y = 0; y < 5; y++)
	{
		this.list[y] = [];
		for( var x = 0; x < 12; x++ )
		{
			var i = new invader( _data.canvas, varieties[y], x * 60 + 100, y * 40 + 100 );
			this.list[y].push( i );
		}
	}

	this.moveRow = y - 1;
	this.moveDelay = 9;
	this.moveCount = this.moveDelay;
	this.moveDirX = 25;
	this.moveDirY = 0;
	this.reverseFlag = false;
	this.bombChance = 0.01;

	Signals.add( "update", this.update, this, null, true );
	Signals.add( "draw", this.draw, this, null, true );
	Signals.add( "invader_dead", this.speedUp, this, null, true );
};


BubbleExtend( invaders, "game_start" );
BubbleEnclose( invaders, invader );


invaders.prototype.update = function()
{
	if ( this.list )
	{
		// make invaders advance on the player's base
		this.advance();

		// make invaders drop bombs sometimes
		this.bombing();

		var count_alive = 0;
		// update all invaders
		for( y = this.list.length - 1; y >= 0; --y )
		{
			for( x = this.list[y].length - 1; x >= 0; --x )
			{
				if ( this.list[y][x].update() )
				{
					count_alive++;
				}
			}
		}

		if ( count_alive === 1 )
		{
			// last invader accelerates to max speed quite quickly
			this.moveDelay = Math.max( this.moveDelay - 0.05 , 1 );
		}

		if ( count_alive === 0 )
		{
			restartGame = true;
		}
	}
};


invaders.prototype.draw = function( _arg1, _ctx )
{
	if ( this.list )
	{
		for( var y = this.list.length - 1; y >= 0; --y )
		{
			for( var x = this.list[y].length - 1; x >= 0; --x )
			{
				this.list[y][x].draw( _arg1, _ctx );
			}
		}
	}
};


invaders.prototype.advance = function()
{
	var x, y;
	// delay between invader rows movement
	this.moveCount--;
	if ( this.moveCount <= 0 )
	{
		// reset the delay counter
		this.moveCount = this.moveDelay;

// TODO: issue invader_move signal with direction information
// TODO: listen for invader_reverse signal for when invaders reach the end of a row

		// move the current row of invaders
		for( x = 0, l = this.list[this.moveRow].length; x < l; x++ )
		{
			if ( this.list[this.moveRow][x].move( this.moveDirX, this.moveDirY ) )
			{       
				// if an invader reaches the end of it's row, they all reverse direction next move
				this.reverseFlag = true;
			}
		}

		// change the current row number
		this.moveRow--;
		if ( this.moveRow < 0 )
		{
			// we've moved them all, start again at the bottom row
			this.moveRow = this.list.length - 1;

			// if any invader reached the end of a row
			if ( this.reverseFlag )
			{
				this.reverseFlag = false;

				// reverse direction for all invaders and move them down once
				this.moveDirX = -this.moveDirX;
				this.moveDirY = 40;

				// gradually get faster
				this.moveDelay = Math.max( this.moveDelay - 0.10, 1 );
			}
			else
			{
				// don't move down unless someone reached the end of a row
				this.moveDirY = 0;
			}
		}
	}
};


invaders.prototype.bombing = function()
{
	if ( Math.random() < this.bombChance )
	{
		// try up to 8 times to pick a valid invaders column
		for( var r = 0; r < 8; r++ )
		{
			// pick an invader column
			var x = Math.floor( Math.random() * this.list[0].length );

			// find the lowest invader in that column
			for( var y = this.list.length - 1; y >= 0; --y )
			{
				if ( this.list[y][x].data.alive )
				{
					// drop a bomb from him
					Signals.dispatch( "invader_fire", this.list[y][x].data );
					return true;
				}
			}
		}
	}
	return false;
};


invaders.prototype.speedUp = function( _arg1, _arg2 )
{
	this.moveDelay = Math.max( this.moveDelay - 0.075, 1 );
	this.bombChance = Math.min( this.bombChance + 0.0003, 0.03 );
};
