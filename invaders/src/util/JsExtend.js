// JsExtend.js
//
// Pete Baron 2016
//
// extend various JS objects and add new 'commands' (global functions)
//



// helper function to use RAF where possible, and fall back to SetTimer if not available
window.requestNextAnimationFrame =
    ( function()
{
    var originalWebkitRequestAnimationFrame,
        wrapper,
        callback,
        geckoVersion = 0,
        userAgent = navigator.userAgent,
        index = 0,
        self = this;

    // Workaround for Chrome 10 bug where Chrome
    // does not pass the time to the animation function

    if ( window.webkitRequestAnimationFrame )
    {
        // Define the wrapper

        wrapper = function( time )
        {
            if ( time === undefined )
            {
                time = +new Date();
            }
            self.callback( time );
        };

        // Make the switch

        originalWebkitRequestAnimationFrame = window.webkitRequestAnimationFrame;

        window.webkitRequestAnimationFrame = function( callback, element )
        {
            self.callback = callback;

            // Browser calls the wrapper and wrapper calls the callback

            originalWebkitRequestAnimationFrame( wrapper, element );
        };
    }

    // Workaround for Gecko 2.0, which has a bug in
    // mozRequestAnimationFrame() that restricts animations
    // to 30-40 fps.

    if ( window.mozRequestAnimationFrame )
    {
        // Check the Gecko version. Gecko is used by browsers
        // other than Firefox. Gecko 2.0 corresponds to
        // Firefox 4.0.

        index = userAgent.indexOf( 'rv:' );

        if ( userAgent.indexOf( 'Gecko' ) != -1 )
        {
            geckoVersion = userAgent.substr( index + 3, 3 );

            if ( geckoVersion === '2.0' )
            {
                // Forces the return statement to fall through
                // to the setTimeout() function.

                window.mozRequestAnimationFrame = undefined;
            }
        }
    }

    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( callback, element )
        {
            var start,
                finish;


            window.setTimeout( function()
            {
                start = Date.now();
                callback( start );
                finish = Date.now();

                self.timeout = 1000 / 60 - ( finish - start );

            }, self.timeout );
        };
} )
();


/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 * 
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 * 
 * @see http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return Math.ceil( metrics.width );      // make sure it's an integer (some browsers return sub-pixel, others don't)
}



//
// Math extensions
//

Math.sgn = function(_value)
{
    return _value < 0 ? -1 : 1;
};

Math.sgn0 = function(_value)
{
    return _value < 0 ? -1 : _value > 0 ? 1 : 0;
};

Math.randRange = function(_min, _max)
{
    return Math.random() * (_max - _min) + _min;
};

Math.randInt = function(_range)
{
    return Math.floor( Math.random() * _range );
};

Math.frac = function(_value)
{
    return ((_value % 1) + 1) % 1;
};

Math.clamp = function(_value, _min, _max)
{
    _value = Math.max( Math.min(_value, _max), _min );
    return _value;
};



//
// Graphic extensions
//

// https://github.com/google/canvas-5-polyfill/blob/master/canvas.js
if (CanvasRenderingContext2D.prototype.ellipse === undefined) {
    CanvasRenderingContext2D.prototype.ellipse = function(x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
        this.save();
        this.translate(x, y);
        this.rotate(rotation);
        this.scale(radiusX, radiusY);
        this.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
        this.restore();
    };
}



//
// Array extensions
//


