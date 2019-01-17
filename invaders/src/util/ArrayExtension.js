//
// ArrayExtension.js
//
// Pete Baron 2016
//
// extend the JS Array prototype with some useful functionality
//


// Array.indexOfPropertyValue extension
// http://stackoverflow.com/questions/7176908/how-to-get-index-of-object-by-its-property-in-javascript
// return the index of the *first* matching property in Array objects
( function()
{
	if ( Array.prototype.indexOfPropertyValue === undefined )
	{
		Array.prototype.indexOfPropertyValue = function( prop, value )
		{
			for ( var i = 0, l = this.length; i < l; i++ )
			{
				if ( this[ i ][ prop ] !== undefined )
				{
					if ( this[ i ][ prop ] == value )
					{
						return i;
					}
				}
			}
			return -1;
		};
	}
} )();


// Array.setPropertyValue extension
( function()
{
	if ( Array.prototype.setPropertyValue === undefined )
	{
		Array.prototype.setPropertyValue = function( prop, value )
		{
			for ( var i = 0, l = this.length; i < l; i++ )
			{
				this[ i ][ prop ] = value;
			}
		};
	}
} )();


// Array.remove extension
// remove the first array element that matches 'value' and return the index where it was found (or -1 if not found)
( function()
{
	if ( Array.prototype.remove === undefined )
	{
		Array.prototype.remove = function( value )
		{
			for ( var i = 0, l = this.length; i < l; i++ )
			{
				if ( this[ i ] === value )
				{
					this.splice(i, 1);
					return i;
				}
			}
			return -1;
		};
	}
} )();


// Array.removeAll extension
// remove the all array elements that match 'value'
( function()
{
	if ( Array.prototype.removeAll === undefined )
	{
		Array.prototype.removeAll = function( value )
		{
			for ( var i = this.length - 1; i >= 0; --i)
			{
				if ( this[ i ] === value )
				{
					this.splice(i, 1);
				}
			}
		};
	}
} )();


// Array.pickRandom extension
( function()
{
	if ( Array.prototype.pickRandom === undefined )
	{
		Array.prototype.pickRandom = function()
		{
			return ( this[ Math.floor( Math.random() * this.length ) ] );
		};
	}
} )();
