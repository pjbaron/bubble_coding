// Canvas.js
//
// Pete Baron 2016
//
// Bubble to create a canvas to draw everything on
//


function Canvas()
{
    // make Canvas bubble listen for the "create_canvas" signal before creating the canvas
    Signals.add( "create_canvas", this.makeCanvas, this, null, true );
}


BubbleExtend( Canvas );


Canvas.prototype.makeCanvas = function( _arg1, _data )
{
    var canvas = document.createElement('canvas');

    canvas.id = "Invaders";
    canvas.style.border = "none";
    canvas.style.position = "absolute";
    canvas.width = _data.width;
    canvas.height = _data.height;
    canvas.x = Math.floor( (window.innerWidth - canvas.width) / 2 );
    canvas.y = Math.floor( (window.innerHeight - canvas.height) / 2 );
    canvas.style.left = canvas.x + "px";
    canvas.style.top = canvas.y + "px";

    document.body.appendChild(canvas);
    
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "#010";
    ctx.fillRect( 0, 0, canvas.width, canvas.height );

    // return the canvas and ctx to the 'owner'
    _data.owner.canvas = canvas;
    _data.owner.ctx = ctx;

    console.log("makeCanvas", canvas.x, canvas.y, canvas.width, canvas.height);
    Signals.deactivate( "create_canvas", this.makeCanvas );
};


