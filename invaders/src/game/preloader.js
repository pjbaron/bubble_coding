// preloader.js
// Pete Baron 2016
//
// preload game assets
//


// global variable for access to loaded images
var textureManager;


function preloader()
{
	Signals.add( "preload_images", this.startLoading, this, null, true );
}


BubbleExtend( preloader );


// make preloader bubble listen for the "preload_images" signal before beginning
preloader.prototype.startLoading = function()
{
	Signals.deactivate( "preload_images", this.startLoading, this );

	textureManager = new Textures();

	textureManager.loadImage( "base1", "images/base.png");
	textureManager.loadImage( "base2", "images/base.png");
	textureManager.loadImage( "base3", "images/base.png");
	textureManager.loadImage( "base4", "images/base.png");
	textureManager.loadImage( "invader_bomb_0", "images/invader_bomb_0.png");
	textureManager.loadImage( "invader_bomb_1", "images/invader_bomb_1.png");
	textureManager.loadImage( "invader_explode", "images/invader_explode.png");
	textureManager.loadImage( "invader1_0", "images/invader1_0.png");
	textureManager.loadImage( "invader1_1", "images/invader1_1.png");
	textureManager.loadImage( "invader2_0", "images/invader2_0.png");
	textureManager.loadImage( "invader2_1", "images/invader2_1.png");
	textureManager.loadImage( "invader3_0", "images/invader3_0.png");
	textureManager.loadImage( "invader3_1", "images/invader3_1.png");
	textureManager.loadImage( "saucer", "images/saucer.png");
	textureManager.loadImage( "ship", "images/ship.png");
	textureManager.loadImage( "ship_bullet", "images/ship_bullet.png");
	textureManager.loadImage( "ship_explode", "images/ship_explode.png");

	var totalFiles = textureManager.pending;
	console.log("preloader loading", totalFiles, "images.");

	// regularly call update until all images are loaded
	Signals.add( "system_tick", this.update, this, null, true );
};


preloader.prototype.update = function()
{
	var totalPending = textureManager.pending;
	// preloaderSubString.text = Math.floor((1.0 - totalPending / totalFiles) * 100).toString() + "%";

	if ( textureManager.pending === 0 )
	{
		Signals.deactivate( "system_tick", this.update, this );
		Signals.dispatch( "preloader_finished" );
		console.log("preloader finished loading.");
	}
};

