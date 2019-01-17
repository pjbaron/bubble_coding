//
// house.js
//
// Pete Baron 2016
//
// an individual house
//



house = function( _index, _x, _y )
{
	// clone the image so that modifying it's content won't affect the loaded original
	this.data = { name: "house", x: _x, y: _y, image: textureManager.getWithKey( "base" + (_index + 1).toString(), true ) };

	// grab the image data for this house
	this.canvas = document.createElement('canvas');
	this.canvas.width = this.data.image.cellWide;
	this.canvas.height = this.data.image.cellHigh;
	this.context = this.canvas.getContext('2d');
	this.context.drawImage( this.data.image, 0, 0 );
	this.imageData = this.context.getImageData( 0, 0, this.data.image.cellWide, this.data.image.cellHigh );

	Signals.add( "draw", this.draw, this, null, true );
	Signals.add( "collision", this.collision, this, null, true );
	Signals.dispatch( "collider_add", this.data );
};


BubbleExtend( house );


house.prototype.draw = function( _arg1, _ctx )
{
	if ( this.data )
	{
		_ctx.drawImage( this.canvas, this.data.x - this.data.image.cellWide / 2, this.data.y );
	}
};


house.prototype.collision = function( _arg1, _obj )
{
	if ( _obj.who == this.data )
	{
		if ( _obj.what.name == "bullet" )
		{
			if ( !this.makeHole( _obj.what.x - (this.data.x - this.data.image.cellWide / 2), _obj.what.y - this.data.y, 12 ) )
			{
				Signals.dispatch( "bullet_kill", null );
				console.log( "player shot a base." );
			}
		}

		if ( _obj.what.name == "invader_bomb" )
		{
			if ( !this.makeHole( _obj.what.x - (this.data.x - this.data.image.cellWide / 2), _obj.what.y - this.data.y, _obj.what.image.cellHigh ) )
			{
				Signals.dispatch( "bomb_kill", _obj.what );
				console.log( "invader bombed a base." );
			}
		}

		if ( _obj.what.name == "invader" )
		{
			this.wipeHole( _obj.what.x - (this.data.x - this.data.image.cellWide / 2), (_obj.what.y + _obj.what.image.cellHigh) - this.data.y );
			console.log( "invader collided with a base." );
		}
	}
};


house.prototype.wipeHole = function( _x, _y )
{
	_y = Math.floor( _y );
	_y -= _y % 4;

	var wide = this.data.image.cellWide;
	var high = this.data.image.cellHigh;

	// access the data as a pixel array
	var data = this.imageData.data;
	var buf8 = new Uint8Array( data.buffer );
	var pixels = new Uint32Array( data.buffer );

	if ( pixels[ _x + wide * (_y - 1) ] !== 0x00000000 )
	{
		for( var y = 0; y < _y; y++ )
		{
			for( var x = 0; x < wide; x++ )
			{
				pixels[ x + wide * y ] = 0x00000000;
			}
		}

		// put the pixel data back into the image
		data.set( buf8 );
		this.context.putImageData( this.imageData, 0, 0 );
	}
};


house.prototype.makeHole = function( _x, _y, _dy )
{
	_x = Math.floor( _x );
	_x -= _x % 4;		// 4x4 = pixel size
	_y = Math.floor( _y );
	_y -= _y % 4;

	var wide = this.data.image.cellWide;
	var high = this.data.image.cellHigh;

	// access the data as a pixel array
	var data = this.imageData.data;
	var buf8 = new Uint8Array( data.buffer );
	var pixels = new Uint32Array( data.buffer );

	// scan a vertical line (to cover the bullet vertical speed)
	for( var yo = _y; yo < _y + _dy; yo++ )
	{
		if ( pixels[ _x + wide * yo ] !== 0x00000000 )
		{
			if ( ( _x >= 0 && _x < wide ) &&
				 ( yo >= 0 && yo < high ) )
			{
				// punch a hole in the building (16 random pixels in a 5x5 area around the impact point)
				this.drawPixel( _x, yo, pixels, wide, high );
				this.drawPixel( _x - 4, yo, pixels, wide, high );
				this.drawPixel( _x + 4, yo, pixels, wide, high );
				for( var i = 0; i < 16; i++ )
				{
					this.drawPixel( _x + (Math.floor( Math.random() * 5 ) - 2) * 4, yo + (Math.floor( Math.random() * 5 ) - 2) * 4, pixels, wide, high );
				}

				// put the pixel data back into the image
				data.set( buf8 );
				this.context.putImageData( this.imageData, 0, 0 );

				return false;
			}
		}
	}

	return true;
};


house.prototype.drawPixel = function( _x, _y, _pixels, _wide, _high )
{
	for( var y = _y; y < _y + 4; y++ )
	{
		if ( y >= 0 && y < _high )
		{
			for( var x = _x; x < _x + 4; x++ )
			{
				if ( x >= 0 && x < _wide )
				{
					_pixels[ x + _wide * y ] = 0x00000000;
				}
			}
		}
	}
};
