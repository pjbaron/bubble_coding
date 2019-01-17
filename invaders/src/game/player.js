// player.js
//
// Pete Baron 2016
//
// control the player's ship horizontally with left/right arrows
// fire the weapon with space
//



player = function( _data )
{
	this.canvas = _data.canvas;

	this.data = {
		name: "player",
		x: this.canvas.width / 2,
		y: this.canvas.height - 100,
		visible: true,
		left: false,
		right: false,
		invulnerable: 0,
		lives: 5,
		image: textureManager.getWithKey( "ship" )
	};
	Signals.dispatch( "collider_add", this.data );

	Signals.add( "update", this.update, this, null, true );
	Signals.add( "draw", this.draw, this, null, true );
	Signals.add( "key_down", this.keyDown, this, null, true );
	Signals.add( "key_up", this.keyUp, this, null, true );
	Signals.add( "collision", this.collision, this, null, true );
};


BubbleExtend( player, "game_start" );


player.prototype.update = function()
{
	if ( this.data )
	{
		if ( this.data.vx !== 0 )
		{
			if ( this.data.visible )
			{
				// move the ship using its velocity x
				if ( this.data.left )
				{
					this.data.x -= 6;
					if ( this.data.x < 32 + this.data.image.cellWide / 2 )
					{
						this.data.x = 32 + this.data.image.cellWide / 2;
					}
				}
				if ( this.data.right )
				{
					this.data.x += 6;
					if ( this.data.x > this.canvas.width - 32 - this.data.image.cellWide / 2 )
					{
						this.data.x = this.canvas.width - 32 - this.data.image.cellWide / 2;
					}
				}
			}
		}

		if ( this.data.invulnerable > 0 )
		{
			this.data.invulnerable--;

			// make the player appear and be controllable before invulnerability wears off
			if ( this.data.invulnerable === 30 )
			{
				this.data.x = this.canvas.width / 2;
				this.data.visible = true;
			}
		}
	}
};


player.prototype.draw = function( _arg1, _ctx )
{
	if ( this.data )
	{
		// draw the ship
		if ( this.data.visible )
		{
			_ctx.drawImage( this.data.image, this.data.x - this.data.image.cellWide / 2, this.data.y );
		}
	}
};


player.prototype.collision = function( _arg1, _obj )
{
	if ( _obj.who === this.data )
	{
		if ( this.data.invulnerable === 0 )
		{
			if ( _obj.what.name == "invader" )
			{
				// console.log( "player caught by invader!" );
				Signals.dispatch( "player_dead", this.data );
				this.newLife();
			}

			if ( _obj.what.name == "invader_bomb" )
			{
				// console.log( "player got bombed!" );
				Signals.dispatch( "player_dead", this.data );
				this.newLife();
			}
		}
	}
};


player.prototype.newLife = function()
{
	this.data.visible = false;
	this.data.invulnerable = 45;
	this.data.lives--;
	if ( this.data.lives <= 0 )
	{
		restartGame = true;
	}
};


player.prototype.keyDown = function( _arg1, _keyCode )
{
	if ( _keyCode == KeyCodes.left_arrow )
	{
		this.data.left = true;
	}
	else if ( _keyCode == KeyCodes.right_arrow )
	{
		this.data.right = true;
	}
	else if ( _keyCode == KeyCodes.space_bar )
	{
		Signals.dispatch( "player_fire", { x: this.data.x, y: this.data.y } );
	}
};


player.prototype.keyUp = function( _arg1, _keyCode )
{
	if ( _keyCode == KeyCodes.left_arrow )
	{
		this.data.left = false;
	}
	else if ( _keyCode == KeyCodes.right_arrow )
	{
		this.data.right = false;
	}
};


