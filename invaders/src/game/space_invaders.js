//
// space_invaders.js
//
// Pete Baron 2016
//
// control bubble to create the game components and govern the game states
//



space_invaders = function()
{
	this.canvas = null;
	this.ctx = null;

    // create a canvas into my this.canvas/this.ctx variables
    new Canvas();
    Signals.dispatch( "create_canvas", { width: window.width, height: window.height, owner: this } );

    // start the preloader (issues 'preloader_finished' when all images are loaded)
    new preloader();
    Signals.dispatch( "preload_images" );

    // start the timer (it's used for preloader as well as the game)
    new Ticker();
    Signals.dispatch( "start_timer", { canvas: this.canvas, ctx: this.ctx } );

    // start the keyboard event listener system
    new Keys();

    // listen for 'preloader_finished' and dispatch 'game_start' when it's received
	Signals.add( "preloader_finished", this.start, this, null, true );
	Signals.add( "game_tick", this.update, this, null, false );
};


BubbleExtend( space_invaders );
// BubbleEnclose( space_invaders, Ticker );
// BubbleEnclose( space_invaders, Canvas );
// BubbleEnclose( space_invaders, preloader );


space_invaders.prototype.start = function()
{
	this.start_count = 0;
	this.start_delay = 120;
    Signals.dispatch( "game_start", { canvas: this.canvas, ctx: this.ctx } );
    Signals.activate( "game_tick", this.update, this );
};


space_invaders.prototype.update = function()
{
	if ( !showGame )
	{
		// don't return, game can run even if not shown
		this.canvas.style.visibility = 'hidden';
	}
	else
	{
		this.canvas.style.visibility = 'visible';
	}

	if ( this.start_count < this.start_delay )
	{
		this.start_count++;
	}
	else
	{
		Signals.dispatch( "update", this );
	}

	Signals.dispatch( "draw", this.ctx );
};


