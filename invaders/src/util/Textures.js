// Textures.js
//
// Pete Baron 2016
//
// a simple texture manager class, loads them and stores them in its 'list'
// use getWithKey to retrieve an image using the 'key' it was loaded with
//




function Textures()
{
	this.list = [];
	this.pending = 0;
}


// specify 0 or undefined for wide and high and this will set the texture to a single cell the full size of the image
Textures.prototype.loadImage = function( key, resourceURL, wide, high, callback, context )
{
	// console.log("Textures.loadImage ", key);

	var image;

	if (this.list[key])
	{
		image = this.list[key];
		return image;
	}

	image = new Image();
	image.key = key;
	image.cellWide = wide;
	image.cellHigh = high;
	image.cellsWide = 0;
	image.cellsHigh = 0;
	image.isReady = false;
	this.list[key] = image;

	var _this = this;
	image.onload = function() {
		image.isReady = true;
		if ( image.cellWide )
		{
			image.cellsWide = image.width / image.cellWide;
		}
		else
		{
			image.cellWide = image.width;
			image.cellsWide = 1;
		}
		if ( image.cellHigh )
		{
			image.cellsHigh = image.height / image.cellHigh;
		}
		else
		{
			image.cellHigh = image.height;
			image.cellsHigh = 1;
		}
		_this.pending--;
		
		if ( callback && context )
		{
			callback.call( context );
		}
	};
	this.pending++;
	image.src = resourceURL;

	return image;
};


Textures.prototype.getWithKey = function( key, clone )
{
	if (key && this.list && this.list[key] && this.list[key].isReady)
	{
		var original = this.list[key];
		if ( !clone )
		{
			return original;
		}

		var image = original.cloneNode( true );
		image.key = original.key;
		image.cellWide = original.cellWide;
		image.cellHigh = original.cellHigh;
		image.cellsWide = original.cellsWide;
		image.cellsHigh = original.cellsHigh;
		image.isReady = original.isReady;

		return image;
	}
	console.log("ERROR: Textures.getWithKey no key found for", key);
	return null;
};

