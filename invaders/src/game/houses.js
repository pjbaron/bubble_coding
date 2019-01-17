//
// houses.js
//
// Pete Baron 2016
//
// manager bubble to handle the list of houses
//



houses = function( _data )
{
	var canvas = _data.canvas;

	this.list =
	[
		new house( 0, canvas.width / 5 * 1, canvas.height - 200 ),
		new house( 1, canvas.width / 5 * 2, canvas.height - 200 ),
		new house( 2, canvas.width / 5 * 3, canvas.height - 200 ),
		new house( 3, canvas.width / 5 * 4, canvas.height - 200 )
	];

	// Signals.add( "draw", this.draw, this, null, true );
};


BubbleExtend( houses, "game_start" );
BubbleEnclose( houses, house );


houses.prototype.draw = function( _arg1, _ctx )
{
	// if ( this.list )
	// {
	// 	for( var i = 0, l = this.list.length; i < l; i++ )
	// 	{
	// 		this.list[i].draw( _arg1, _ctx );
	// 	}
	// }
};


