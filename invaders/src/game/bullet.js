// bullet.js
//
// Pete Baron 2016
//
// move the player's bullet
//


bullet = function()
{
	this.data = { name: "bullet", x: 0, y: 0, vy: -12, image: textureManager.getWithKey( "ship_bullet" ), visible: false };

	Signals.add( "update", this.update, this, null, true );
	Signals.add( "draw", this.draw, this, null, true );
	Signals.add( "player_fire", this.shoot, this, null, true );
	Signals.add( "collision", this.collision, this, null, true );
	Signals.add( "bullet_kill", this.kill, this, null, true );
};


BubbleExtend( bullet, "game_start" );


bullet.prototype.update = function()
{
	if ( this.data )
	{
		if ( this.data.visible )
		{
			this.data.y += this.data.vy;
			if ( this.data.y <= -this.data.image.height )
			{
				this.deactivate();
				return;
			}
		}
	}
};


bullet.prototype.draw = function( _arg1, _ctx )
{
	if ( this.data )
	{
		if ( this.data.visible )
		{
			// draw the bullet
			_ctx.drawImage( this.data.image, this.data.x - this.data.image.cellWide / 2, this.data.y );
		}
	}
};


bullet.prototype.shoot = function( _arg1, _playerPosition )
{
	if ( !this.data.visible )
	{
		this.data.x = _playerPosition.x;
		this.data.y = _playerPosition.y - this.data.image.height / 2;
		this.data.visible = true;
		Signals.dispatch( "collider_add", this.data );
		Signals.dispatch( "bullet_fired", null );
	}
};


bullet.prototype.collision = function( _arg1, _obj )
{
	if ( _obj.who === this.data )
	{
		if ( _obj.what.name == "invader" )
		{
			//console.log( "bullet hit invader!" );
			this.deactivate();
		}

		if ( _obj.what.name == "invader_bomb" )
		{
			//console.log( "bullet hit bomb!" );
			this.deactivate();
		}

		if ( _obj.what.name == "saucer" )
		{
			//console.log( "bullet hit saucer!" );
			this.deactivate();
		}
	}
};


bullet.prototype.kill = function()
{
	this.deactivate();
};


bullet.prototype.deactivate = function()
{
	Signals.dispatch( "collider_remove", this.data );
	this.data.visible = false;
};


