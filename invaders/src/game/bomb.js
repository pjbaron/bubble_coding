// bomb.js
//
// Pete Baron 2016
//
// control a bomb
//


bomb = function( _canvas )
{
	this.canvas = _canvas;

	this.frames =
	[
		textureManager.getWithKey( "invader_bomb_0" ),
		textureManager.getWithKey( "invader_bomb_1" )
	];
	this.data = { name: "invader_bomb", x: 0, y: 0, image: this.frames[0], visible: false, remove: false, vy: 3, cell: 0, animCount: 0, animDelay: 16 };

	Signals.add( "update", this.update, this, null, true );
	Signals.add( "draw", this.draw, this, null, true );
	Signals.add( "collision", this.collision, this, null, false );
};


BubbleExtend( bomb );


bomb.prototype.update = function()
{
	if ( this.data && this.data.visible )
	{
		this.data.y += this.data.vy;
		if ( this.data.y > this.canvas.height )
		{
			this.data.remove = true;
		}
		else
		{
			// animate
			if ( this.data.animCount++ >= this.data.animDelay )
			{
				this.data.cell ^= 1;
				this.data.image = this.frames[ this.data.cell ];
				this.data.animCount = 0;
			}
		}
	}

	if ( this.data.remove )
	{
		this.data.remove = false;
		this.deactivate();
	}
};


bomb.prototype.draw = function( _arg1, _ctx )
{
	if ( this.data && this.data.visible )
	{
		if ( this.data.y <= this.canvas.height )
		{
			// draw the bomb
			_ctx.drawImage( this.data.image, this.data.x - this.data.image.cellWide / 2, this.data.y );
		}
	}
};


bomb.prototype.collision = function( _arg1, _obj )
{
	if ( _obj.who === this.data )
	{
		if ( _obj.what.name == "player" )
		{
			//console.log( "bomb hit player!" );
			this.data.remove = true;
		}

		if ( _obj.what.name == "bullet" )
		{
			//console.log( "bomb hit bullet!" );
			this.data.remove = true;
		}
	}
};


bomb.prototype.activate = function( _obj )
{
	this.data.x = _obj.x;
	this.data.y = _obj.y + _obj.image.cellHigh - this.data.image.cellHigh * 0.5;
	this.data.visible = true;
	Signals.activate( "collision", this.collision, this );
	Signals.dispatch( "collider_add", this.data );
};


bomb.prototype.deactivate = function()
{
	Signals.dispatch( "collider_remove", this.data );
	Signals.deactivate( "collision", this.collision, this );
	this.data.visible = false;
	this.data.x = this.data.y = -1000;
};


