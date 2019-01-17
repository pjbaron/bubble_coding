// Ticker.js
//
// Pete Baron 2016
//
// Bubble to dispatch "tick" type signals and manage game restart
//



// global to kill the running game and start a new one
var restartGame = false;
var pauseGame = false;      // run Game if true, pause it if false
var showGame = false;       // show Bubble System if false, game if true
var showChildren = true;



function Ticker()
{
	// make Ticker bubble listen for the "start_game" signal before beginning

	// _key, _callback, _context, _arg1, _activate
	Signals.add( "start_timer", this.playGame, this, null, true );
	Signals.add( "key_up", this.keyboardToggles, this, null, true );
}


BubbleExtend( Ticker );


//
// the main game start and loop function
//

Ticker.prototype.playGame = function( _arg1, _data )
{
	var rafID;

	var canvas = _data.canvas;
	var ctx = _data.ctx;

	Signals.dispatch( "init_game" );

	// timer loop callback
	var onLoop = function()
	{
		stats.begin();

		// schedule the next timer
		rafID = window.requestNextAnimationFrame( onLoop, canvas );

		// if the game isn't paused, update it even if we're looking at the bubble system
		if ( !pauseGame )
		{
			// clear the canvas, animation is continuous
			ctx.fillStyle = "#010";
			ctx.fillRect( 0, 0, canvas.width, canvas.height );

			// send the "game_tick" signal when game is not paused
			Signals.dispatch( "game_tick" );
		}

		// send a system tick regardless of pause state
		Signals.dispatch( "system_tick" );
		
		if ( restartGame )
		{
			console.clear();
			console.log( "reloading game page!" );
			Signals.dispatch( "restart_game" );
			window.location.reload();
		}

		stats.end();
	};

	// start the timer
	rafID = window.requestNextAnimationFrame( onLoop, canvas );
};


Ticker.prototype.keyboardToggles = function( _arg1, _data )
{
	if ( _data == KeyCodes.key_p )
	{
		pauseGame = !pauseGame;
		console.log("pauseGame = ", pauseGame);
	}

	if ( _data == KeyCodes.key_s )
	{
		showGame = !showGame;
		console.log("showGame = ", showGame);
	}

	if ( _data == KeyCodes.key_c )
	{
		showChildren = !showChildren;
		console.log("showChildren = ", showChildren);
	}
};
